
// Dummy verifyToken middleware
// TODO: Implement actual JWT verification

const verifyToken = (req, res, next) => {
    // Just call next() for now
    next();
};

module.exports = verifyToken;
