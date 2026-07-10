exports.parsePositiveInt = (value, fieldName = 'id') => {
    const parsed = Number.parseInt(String(value ?? ''), 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return { ok: false, message: `Invalid ${fieldName}.` };
    }
    return { ok: true, value: parsed };
};

exports.parsePositiveIntOrNull = (value) => {
    if (value === undefined || value === null || value === '') {
        return null;
    }
    const parsed = Number.parseInt(String(value), 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return null;
    }
    return parsed;
};

exports.parsePagination = (query, { maxLimit = 100, defaultLimit = 10 } = {}) => {
    const page = Math.max(1, Number.parseInt(String(query.page ?? '1'), 10) || 1);
    let limit = Number.parseInt(String(query.limit ?? String(defaultLimit)), 10) || defaultLimit;
    limit = Math.min(Math.max(1, limit), maxLimit);
    const offset = (page - 1) * limit;
    return { page, limit, offset };
};
