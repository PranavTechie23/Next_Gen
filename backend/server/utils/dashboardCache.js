const db = require('../config/db');

const DASHBOARD_CACHE_TTL_MINUTES = 2;
let placementAnalyticsTableReady = null;

const ensurePlacementAnalyticsTable = async () => {
    if (!placementAnalyticsTableReady) {
        placementAnalyticsTableReady = db.query(`
        CREATE TABLE IF NOT EXISTS placement_analytics (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            scope VARCHAR(100) NOT NULL,
            payload_json LONGTEXT NOT NULL,
            generated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY uq_scope (scope)
        )
    `).catch((error) => {
            placementAnalyticsTableReady = null;
            throw error;
        });
    }
    await placementAnalyticsTableReady;
};

async function getCachedDashboardRow(cacheScopeKey) {
    const [rows] = await db.query(
        `SELECT payload_json, generated_at
         FROM placement_analytics
         WHERE scope = ?
         LIMIT 1`,
        [cacheScopeKey]
    );
    if (!rows.length) return null;
    return rows[0];
}

const getCachedDashboardPayload = async (cacheScopeKey) => {
    const row = await getCachedDashboardRow(cacheScopeKey);
    if (!row) return null;

    const generatedAt = row.generated_at ? new Date(row.generated_at) : null;
    if (!generatedAt) return null;

    const ageMs = Date.now() - generatedAt.getTime();
    const ttlMs = DASHBOARD_CACHE_TTL_MINUTES * 60 * 1000;
    if (ageMs > ttlMs) return null;

    try {
        return JSON.parse(row.payload_json);
    } catch {
        return null;
    }
};

const getCachedDashboardPayloadStale = async (cacheScopeKey) => {
    const row = await getCachedDashboardRow(cacheScopeKey);
    if (!row) return null;
    try {
        const payload = JSON.parse(row.payload_json);
        const generatedAt = row.generated_at ? new Date(row.generated_at) : null;
        const isStale = !generatedAt
            || (Date.now() - generatedAt.getTime()) > DASHBOARD_CACHE_TTL_MINUTES * 60 * 1000;
        return { payload, generatedAt, isStale };
    } catch {
        return null;
    }
};

const setCachedDashboardPayload = async (cacheScopeKey, payload) => {
    await db.query(
        `INSERT INTO placement_analytics (scope, payload_json, generated_at)
         VALUES (?, ?, NOW())
         ON DUPLICATE KEY UPDATE
            payload_json = VALUES(payload_json),
            generated_at = VALUES(generated_at)`,
        [cacheScopeKey, JSON.stringify(payload)]
    );
};

const refreshDashboardCacheInBackground = (buildPayload, cacheScopeKey) => {
    setImmediate(async () => {
        try {
            const payload = await buildPayload();
            await setCachedDashboardPayload(cacheScopeKey, payload);
        } catch (error) {
            console.error('Background dashboard cache refresh failed:', error.message);
        }
    });
};

const buildMeta = (stale = false, generatedAt = null) => ({
    cached: true,
    stale,
    syncIntervalMinutes: DASHBOARD_CACHE_TTL_MINUTES,
    generatedAt: generatedAt ? generatedAt.toISOString() : null,
});

/**
 * Stale-while-revalidate: return fresh cache, else stale + background rebuild, else build now.
 */
const serveCachedDashboard = async (req, res, { cacheScopeKey, buildPayload }) => {
    await ensurePlacementAnalyticsTable();
    const forceRefresh = String(req.query?.refresh || '').toLowerCase() === 'true';

    if (!forceRefresh) {
        const cachedPayload = await getCachedDashboardPayload(cacheScopeKey);
        if (cachedPayload) {
            return res.status(200).json({
                ...cachedPayload,
                _meta: buildMeta(false),
            });
        }

        const staleEntry = await getCachedDashboardPayloadStale(cacheScopeKey);
        if (staleEntry?.payload) {
            refreshDashboardCacheInBackground(buildPayload, cacheScopeKey);
            return res.status(200).json({
                ...staleEntry.payload,
                _meta: buildMeta(true, staleEntry.generatedAt),
            });
        }
    }

    const payload = await buildPayload();
    await setCachedDashboardPayload(cacheScopeKey, payload);
    return res.status(200).json({
        ...payload,
        _meta: { cached: false, stale: false, syncIntervalMinutes: DASHBOARD_CACHE_TTL_MINUTES },
    });
};

module.exports = {
    DASHBOARD_CACHE_TTL_MINUTES,
    ensurePlacementAnalyticsTable,
    getCachedDashboardPayload,
    getCachedDashboardPayloadStale,
    setCachedDashboardPayload,
    refreshDashboardCacheInBackground,
    serveCachedDashboard,
};
