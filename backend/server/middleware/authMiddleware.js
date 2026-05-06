const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.protect = async (req, res, next) => {
    let token;

    // Prefer explicit Authorization header over cookie.
    // This avoids stale/blacklisted cookies overriding a fresh bearer token.
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (token) {
        try {
            const connection = await db.getConnection();

            try {
                // 1. Check if token is blacklisted
                const [blacklistedToken] = await connection.execute(
                    'SELECT token FROM token_blacklist WHERE token = ?',
                    [token]
                );

                if (blacklistedToken.length > 0) {
                    connection.release();
                    return res.status(401).json({ message: "Not authorized. Token matches a logged-out session." });
                }

                // 2. Verify Token
                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                // 3. Check if user still exists
                const [currentUser] = await connection.execute(
                    'SELECT id, email, role, institution_id FROM users WHERE id = ?',
                    [decoded.id]
                );

                if (currentUser.length === 0) {
                    connection.release();
                    return res.status(401).json({ message: "The user belonging to this token no longer exists." });
                }

                // 4. Grant Access
                req.user = currentUser[0];
                req.token = token; // Attach token for logout
                
                // Debug Header for troubleshooting 403s on Render
                res.setHeader('X-Auth-Role', req.user.role || 'NONE');
                res.setHeader('X-Auth-Id', req.user.id || 'NONE');
                
                next();

            } finally {
                connection.release();
            }

        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: "Not authorized, token failed." });
        }
    } else {
        res.status(401).json({ message: "Not authorized, no token." });
    }
};

// --- Role Authorization Middleware ---
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized. User not found." });
        }

        const userRole = (req.user.role || '').toUpperCase();
        const requiredRoles = roles.map(r => r.toUpperCase());

        if (!requiredRoles.includes(userRole)) {
            return res.status(403).json({ 
                message: `Access denied. User role '${userRole}' is not authorized. Required: [${requiredRoles.join(', ')}]`,
                code: 'ROLE_MISMATCH'
            });
        }
        next();
    };
};
