const rateLimit = require('express-rate-limit');

/*
 * Requires app.set('trust proxy', 1) in Express setup when running behind
 * a reverse proxy or load balancer, otherwise req.ip resolves to the proxy
 * address and all clients share a single bucket.
 */

const isProduction = process.env.NODE_ENV === 'production';

const base = {
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, _next, options) => {
        res.status(options.statusCode).json({
            message: options.message?.message || options.message || 'Too many requests. Please slow down.',
            retryAfter: Math.ceil(options.windowMs / 1000),
        });
    },
};

/** Login, register, password reset. */
exports.authLimiter = rateLimit({
    ...base,
    windowMs: 15 * 60 * 1000,
    max: isProduction ? 20 : 100,
    message: { message: 'Too many authentication attempts. Please try again later.' },
});

/** OTP and verification endpoints. */
exports.authSensitiveLimiter = rateLimit({
    ...base,
    windowMs: 15 * 60 * 1000,
    max: isProduction ? 10 : 50,
    message: { message: 'Too many verification attempts. Please try again later.' },
});

/** General abuse protection for authenticated routes. */
exports.apiLimiter = rateLimit({
    ...base,
    windowMs: 15 * 60 * 1000,
    max: isProduction ? 300 : 1000,
    message: { message: 'Too many requests. Please slow down.' },
});

/** Feedback form rate limiting. */
exports.feedbackLimiter = rateLimit({
    ...base,
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: 'You have submitted too much feedback recently. Please try again later.' },
});

/** File uploads (resume, avatar, bulk Excel, JD parse). */
exports.uploadLimiter = rateLimit({
    ...base,
    windowMs: 60 * 60 * 1000,
    max: isProduction ? 20 : 80,
    message: { message: 'Too many file uploads. Please try again in a few minutes.' },
});

/** Report / CSV / PDF exports. */
exports.exportLimiter = rateLimit({
    ...base,
    windowMs: 15 * 60 * 1000,
    max: isProduction ? 30 : 120,
    message: { message: 'Too many export requests. Please wait before downloading again.' },
});

/**
 * Dashboard cache bypass (?refresh=true). Normal cached reads are not counted.
 * Aligns with the 15-minute manual refresh UX on dashboards.
 */
exports.analyticsRefreshLimiter = rateLimit({
    ...base,
    windowMs: 15 * 60 * 1000,
    max: isProduction ? 10 : 40,
    skip: (req) => String(req.query?.refresh || '').toLowerCase() !== 'true',
    message: { message: 'Too many dashboard refresh requests. Please wait before refreshing again.' },
});
