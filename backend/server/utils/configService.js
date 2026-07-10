const db = require('../config/db');

/**
 * Professional ConfigService to manage dynamic platform settings.
 * Implements a simple time-based cache to minimize database overhead.
 */
class ConfigService {
    constructor() {
        this.cache = new Map();
        this.cacheTTL = 300000; // 5 minutes cache
    }

    /**
     * Get a configuration value by key.
     * Returns the parsed JSON value.
     */
    async getConfig(key, defaultValue = null) {
        const now = Date.now();
        const cached = this.cache.get(key);

        if (cached && (now - cached.timestamp < this.cacheTTL)) {
            return cached.value;
        }

        try {
            const [rows] = await db.execute(
                'SELECT config_value FROM platform_config WHERE config_key = ?',
                [key]
            );

            if (rows.length === 0) {
                console.warn(`[ConfigService] Key "${key}" not found in DB. Using default.`);
                return defaultValue;
            }

            const value = rows[0].config_value;
            this.cache.set(key, { value, timestamp: now });
            return value;
        } catch (error) {
            console.error(`[ConfigService] Error fetching key "${key}":`, error.message);
            return defaultValue;
        }
    }

    /**
     * Force refresh the cache for a specific key or all keys.
     */
    refresh(key = null) {
        if (key) {
            this.cache.delete(key);
        } else {
            this.cache.clear();
        }
    }
}

module.exports = new ConfigService();
