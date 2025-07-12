const User = require('../models/User'); 

// Middleware to check if the authenticated user has the 'admin' role
const admin = (req, res, next) => {
    // The `protect` middleware should have already attached the user object to req.user
    if (req.user && req.user.role === 'admin') {
        next(); // User is an admin, proceed to the next middleware/controller
    } else {
        // User is not an admin, send a 403 Forbidden status
        res.status(403).json({ message: 'Not authorized as an administrator' });
    }
};

module.exports = { admin };