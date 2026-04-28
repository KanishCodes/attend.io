const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Read the JWT from the cookie
    token = req.cookies.jwt;

    if (token) {
        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from DB (excluding password)
            req.user = await User.findById(decoded.userId).select('-password');

            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            res.render('auth-error', { 
                message: "Not authorized, token failed.", 
                linkText: "Back to Login", 
                linkUrl: "/login" 
            });
        }
    } else {
        res.status(401);
        res.render('auth-error', { 
            message: "Not authorized, no token.", 
            linkText: "Login Now", 
            linkUrl: "/login" 
        });
    }
};

// Middleware to check if user is a teacher
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'teacher') {
        next();
    } else {
        res.status(401);
        res.render('auth-error', { 
            message: "Not authorized as a teacher.", 
            linkText: "Back to Home", 
            linkUrl: "/" 
        });
    }
};

module.exports = { protect, admin };
