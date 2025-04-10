const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authentication middleware
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Role-based authorization middleware
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Role ${req.user.role} is not authorized to access this resource` 
            });
        }
        next();
    };
};

// Check if user is active
const checkActive = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user.isActive) {
            return res.status(403).json({ message: 'Account is deactivated' });
        }
        
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    authenticate,
    authorize,
    checkActive
};
