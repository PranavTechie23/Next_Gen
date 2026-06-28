const rateLimit = require('express-rate-limit');

/*
 * Requires app.set('trust proxy', 1) in Express setup when running behind
 * a reverse proxy or load balancer, otherwise req.ip resolves to the proxy
 * address and all clients share a single bucket.
 */

const isProduction = process.env.NODE_ENV === 'production';

const base = {
    standardHeaders: true,
    legacyHeaders:   false,
};

/** Login, register, password reset. */
exports.authLimiter = rateLimit({
    ...base,
    windowMs: 15 * 60 * 1000,
    max:      isProduction ? 20 : 100,
    message:  { message: 'Too many authentication attempts. Please try again later.' },
});

/** OTP and verification endpoints. */
exports.authSensitiveLimiter = rateLimit({
    ...base,
    windowMs: 15 * 60 * 1000,
    max:      isProduction ? 10 : 50,
    message:  { message: 'Too many verification attempts. Please try again later.' },
});

/** General abuse protection for authenticated routes. */
exports.apiLimiter = rateLimit({
    ...base,
    windowMs: 15 * 60 * 1000,
    max:      isProduction ? 300 : 1000,
    message:  { message: 'Too many requests. Please slow down.' },
});