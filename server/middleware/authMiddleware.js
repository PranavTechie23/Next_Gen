const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.protect = async (req, res, next) => {
    let token;

    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
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

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `User role '${req.user.role}' is not authorized to access this route.` 
            });
        }
        next();
    };
};
