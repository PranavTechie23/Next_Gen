
// Dummy authorizeRole middleware
// TODO: Implement actual role authorization

const authorizeRole = (role) => {
    return (req, res, next) => {
        // Just call next() for now, ignoring role
        next();
    };
};

module.exports = authorizeRole;
