const isProduction = process.env.NODE_ENV === 'production';

const redactEmail = (email) => {
    if (!email || typeof email !== 'string') return '[redacted]';
    const at = email.indexOf('@');
    if (at <= 0) return '[redacted]';
    const user = email.slice(0, at);
    const domain = email.slice(at + 1);
    const masked = user.length <= 2 ? '***' : `${user.slice(0, 2)}***`;
    return `${masked}@${domain}`;
};

const formatMeta = (meta) => {
    if (!meta || typeof meta !== 'object') return meta;
    const safe = { ...meta };
    if (safe.email) safe.email = redactEmail(safe.email);
    return safe;
};

module.exports = {
    info: (...args) => console.log(...args),
    warn: (...args) => console.warn(...args),
    error: (...args) => console.error(...args),
    auth: (message, meta) => {
        if (isProduction) {
            const extra = meta ? ` ${JSON.stringify(formatMeta(meta))}` : '';
            console.log(`[AUTH] ${message}${extra}`);
            return;
        }
        console.log(`[AUTH] ${message}`, meta || '');
    },
    request: (method, url, origin) => {
        if (isProduction) return;
        console.log(`[${new Date().toISOString()}] ${method} ${url} - Origin: ${origin || '-'}`);
    },
};
