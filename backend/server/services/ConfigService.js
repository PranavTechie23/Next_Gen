const db = require('../config/db');

class ConfigService {
    constructor() {
        this.cache = new Map();
        this.lastFetch = 0;
        this.TTL = 1000 * 60 * 5; // 5 minutes
        this.initialized = false;
        this.initializing = null;
        this.cacheRefreshing = null;
    }

    /* ─────────────────────────────────────────────────────────────────────────
     * PUBLIC READ API
     * ───────────────────────────────────────────────────────────────────────── */

    /**
     * Retrieve a config value by key.
     * Returns `defaultValue` when the key does not exist.
     */
    async get(key, defaultValue = null) {
        await this._ensureCache();
        return this.cache.has(key) ? this.cache.get(key) : defaultValue;
    }

    /**
     * Retrieve a config value and coerce it to a finite number.
     * Returns `defaultValue` when the key is missing or the value is not numeric.
     *
     * FIX (Problem 5): `val !== null` was previously used, but that check passes
     * for `undefined` (key absent, no explicit default). Using `val != null`
     * correctly rejects both null and undefined in one expression.
     */
    async getNumber(key, defaultValue = 0) {
        const val = await this.get(key);
        if (val == null) return defaultValue;
        const n = parseFloat(val);
        return isFinite(n) ? n : defaultValue;
    }

    /**
     * Retrieve a config value and coerce it to a boolean.
     * Accepts stored values: true/false (JSON), "true"/"false", 1/0, "1"/"0".
     *
     * NEW: getBoolean is safe because _serializeValue no longer wraps plain
     * strings in JSON quotes, so booleans reach this method as actual booleans.
     */
    async getBoolean(key, defaultValue = false) {
        const val = await this.get(key);
        if (val == null)          return defaultValue;
        if (typeof val === 'boolean') return val;
        if (val === 1 || val === '1' || val === 'true')  return true;
        if (val === 0 || val === '0' || val === 'false') return false;
        return defaultValue;
    }

    /* ─────────────────────────────────────────────────────────────────────────
     * PUBLIC WRITE API
     *
     * FIX (Problem 4): There was no set() or invalidate() method. Without them,
     * any DB write from an admin panel or external process would leave the app
     * serving stale values for up to the full 5-minute TTL with no way to force
     * a refresh short of restarting the process.
     * ───────────────────────────────────────────────────────────────────────── */

    /**
     * Persist a config value and update the local cache immediately.
     * Accepts strings, numbers, booleans, objects, and arrays.
     */
    async set(key, value) {
        const serialized = _serializeValue(value);
        await db.query(
            `INSERT INTO platform_config (config_key, config_value)
             VALUES (?, ?)
             ON DUPLICATE KEY UPDATE
                 config_value = VALUES(config_value),
                 updated_at   = CURRENT_TIMESTAMP`,
            [key, serialized]
        );
        /* Write through: update local cache so callers see the new value
         * immediately without waiting for the next TTL expiry. */
        this.cache.set(key, value);
    }

    /**
     * Force the cache to refresh on the next get() call.
     * Call this after an external process modifies platform_config directly.
     */
    invalidate() {
        this.lastFetch = 0;
    }

    /* ─────────────────────────────────────────────────────────────────────────
     * INITIALIZATION
     * ───────────────────────────────────────────────────────────────────────── */

    /**
     * Must be called once during app startup (e.g. in server.js before app.listen).
     *
     * FIX (Problem 1): The original catch block logged the error but did NOT
     * rethrow it. This caused two silent failure modes:
     *   a) If the DB was down at startup, initialized stayed false and
     *      initializing was nulled, so every subsequent call re-entered and
     *      re-failed silently while returning defaultValues for all keys —
     *      including critical scoring weights — with zero indication of a problem.
     *   b) The app appeared healthy but was running on entirely wrong config.
     * Fix: rethrow so the process crashes loudly at startup, not silently at runtime.
     *
     * NOTE (Problem 3): The SHOW COLUMNS migration check is MySQL-specific and
     * belongs in a versioned migration file (db-migrate / Flyway / plain SQL
     * run at deploy time), not in application boot code. It is retained here
     * for backward compatibility with existing deployments but is marked clearly
     * so it can be extracted when a proper migration system is adopted.
     */
    async initialize() {
        if (this.initialized) {
            await this._ensureCache();
            return;
        }
        if (this.initializing) {
            return this.initializing;
        }

        this.initializing = (async () => {
            try {
                /* Create table if it does not exist yet. */
                await db.query(`
                    CREATE TABLE IF NOT EXISTS platform_config (
                        config_key   VARCHAR(100) PRIMARY KEY,
                        config_value TEXT         NOT NULL,
                        description  VARCHAR(255),
                        category     VARCHAR(50)  DEFAULT 'GENERAL',
                        updated_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
                                                  ON UPDATE CURRENT_TIMESTAMP
                    )
                `);

                /*
                 * SCHEMA MIGRATION — MySQL-specific.
                 * TODO: Move to a versioned migration file before adopting
                 * a multi-DB strategy or a proper migration tool.
                 */
                try {
                    const [cols] = await db.query("SHOW COLUMNS FROM platform_config LIKE 'category'");
                    if (cols.length === 0) {
                        await db.query(
                            "ALTER TABLE platform_config ADD COLUMN category VARCHAR(50) DEFAULT 'GENERAL' AFTER description"
                        );
                        console.log("ConfigService: Added 'category' column to platform_config.");
                    }
                } catch (migrationErr) {
                    /* Non-fatal: log and continue. The column may already exist
                     * in environments where the DDL above already ran. */
                    console.error("ConfigService: Schema migration check failed.", migrationErr.message);
                }

                /* Seed default values.
                 *
                 * FIX (Problem 2): The original code called JSON.stringify() on
                 * every value unconditionally. For a plain string like '6.0' that
                 * produced '"6.0"' (with JSON quotes) in the DB. This happened to
                 * work because getNumber uses parseFloat, but a future getBoolean
                 * would have received the string "true" instead of a real boolean,
                 * breaking the coercion. _serializeValue now only JSON-encodes
                 * objects and arrays; all scalar values are stored as plain strings.
                 */
                const defaults = [
                    ['READINESS_ACADEMIC_WEIGHT', '0.5',       'Weight for academic performance in readiness score',   'SCORING'],
                    ['READINESS_SKILLS_WEIGHT',   '0.3',       'Weight for skills count in readiness score',           'SCORING'],
                    ['READINESS_PORTFOLIO_WEIGHT','0.2',       'Weight for projects/resume in readiness score',        'SCORING'],
                    ['MIN_CGPA_THRESHOLD',        '6.0',       'Minimum CGPA for placement eligibility',               'ELIGIBILITY'],
                    ['MIN_SKILLS_THRESHOLD',      '5',         'Minimum skills count for at-risk signaling',           'ELIGIBILITY'],
                    ['PRODUCT_PACKAGE_THRESHOLD', '10',        'Min package (LPA) to classify as Product-Based',       'ANALYTICS'],
                    ['STARTUP_PACKAGE_THRESHOLD', '7',         'Max package (LPA) to classify as Startup',            'ANALYTICS'],
                    ['APP_NAME',                  'NextGen',   'Application name for branding',                        'BRANDING'],
                    ['INSTITUTION_NAME',          'Professional Institute of Technology', 'Institution name',          'BRANDING'],
                    ['APP_LOGO_URL',              '/NG/NextGen_light.png', 'Logo URL for the platform',               'BRANDING'],
                    ['SUPPORT_EMAIL',             'support@nextgen.com',   'Support email address',                   'BRANDING'],
                    ['FOOTER_TEXT',               '© 2026 NextGen. All rights reserved.', 'Footer copyright text',   'BRANDING'],
                    ['llm_settings', { model: 'llama-3.1-8b-instant', temperature: 0.2, max_tokens: 1024 },
                                               'Default LLM provider settings (JSON)',                                'AI'],
                ];

                for (const [key, val, desc, cat] of defaults) {
                    await db.query(
                        `INSERT IGNORE INTO platform_config
                             (config_key, config_value, description, category)
                         VALUES (?, ?, ?, ?)`,
                        [key, _serializeValue(val), desc, cat]
                    );
                }

                await this._ensureCache();
                this.initialized = true;
                console.log("ConfigService: Initialized successfully with defaults.");

            } catch (error) {
                /*
                 * FIX (Problem 1): Rethrow so the caller (app startup) sees the
                 * failure immediately. The alternative — swallowing the error —
                 * causes the app to run silently on wrong/empty config, which is
                 * far harder to diagnose than a startup crash.
                 */
                console.error("ConfigService: Initialization failed.", error);
                throw error;

            } finally {
                /* Always clear the lock so the next call can retry if needed. */
                this.initializing = null;
            }
        })();

        return this.initializing;
    }

    /* ─────────────────────────────────────────────────────────────────────────
     * PRIVATE HELPERS
     * ───────────────────────────────────────────────────────────────────────── */

    /**
     * Refresh the in-memory cache from the DB when the TTL has expired
     * or the cache is empty.
     */
   async _ensureCache() {
    const now = Date.now();

    if (
        now - this.lastFetch <= this.TTL &&
        this.cache.size > 0
    ) {
        return;
    }

    if (this.cacheRefreshing) {
        return this.cacheRefreshing;
    }

    this.cacheRefreshing = (async () => {
        try {
            const [rows] = await db.query(
                "SELECT config_key, config_value FROM platform_config"
            );

            this.cache.clear();

            for (const row of rows) {
                this.cache.set(
                    row.config_key,
                    _deserializeValue(row.config_value)
                );
            }

            this.lastFetch = Date.now();
        } finally {
            this.cacheRefreshing = null;
        }
    })();

    return this.cacheRefreshing;
}
}

/* ─────────────────────────────────────────────────────────────────────────────
 * MODULE-LEVEL HELPERS (pure functions, no `this` dependency)
 *
 * Extracted from the class body so they are clearly stateless utilities.
 * ───────────────────────────────────────────────────────────────────────────── */

/**
 * Serialize a value for storage in the TEXT column.
 *
 * FIX (Problem 2): Only objects and arrays are JSON-encoded. Scalars
 * (string, number, boolean) are stored as plain strings. This ensures:
 *   - Numbers like 0.5 reach the DB as "0.5", not '"0.5"'
 *   - Booleans like true reach the DB as "true", not '"true"'
 *   - getBoolean and similar typed getters work correctly without hacks.
 */
function _serializeValue(val) {
    if (val === null || val === undefined) return 'null';
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
}

/**
 * Deserialize a raw DB string back to its original type.
 *
 * Attempts JSON.parse first to recover objects, arrays, and JSON-encoded
 * scalars. Falls back to the raw string on parse failure (e.g. plain
 * strings like "NextGen" that are not valid JSON).
 */
function _deserializeValue(raw) {
    if (typeof raw !== 'string') return raw;
    try {
        return JSON.parse(raw);
    } catch {
        return raw; // plain string — keep as-is
    }
}

module.exports = new ConfigService();