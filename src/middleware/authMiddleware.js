const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middlewares
 * Used to protect routes and verify user sessions using JWT (JSON Web Tokens).
 */

const protect = async (req, res, next) => {
    let token;

    // Read the JWT from the cookie (Secretly stored in browser)
    token = req.cookies.jwt;

    if (token) {
        try {
            // Verify the token using our secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch user from database and attach to the 'req' object
            req.user = await User.findById(decoded.userId).select('-password');

            next(); // Allow user to proceed
        } catch (error) {
            console.error(error);
            res.status(401);
            res.render('auth-error', { 
                message: "Session expired or invalid. Please log in again.", 
                linkText: "Back to Login", 
                linkUrl: "/login" 
            });
        }
    } else {
        // No token found - User is not logged in
        res.status(401);
        res.render('auth-error', { 
            message: "You need to log in to access this page.", 
            linkText: "Login Now", 
            linkUrl: "/login" 
        });
    }
};

// Check if user has 'teacher' role for specific administrative actions
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'teacher') {
        next();
    } else {
        res.status(401);
        res.render('auth-error', { 
            message: "Teacher access required for this action.", 
            linkText: "Back to Home", 
            linkUrl: "/" 
        });
    }
};

// Check user status for the navigation header (doesn't block access)
const checkUser = async (req, res, next) => {
    let token = req.cookies.jwt;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password');
        } catch (error) {
            req.user = null;
        }
    } else {
        req.user = null;
    }
    next();
};

// Ensure users who join via Google complete their profile (Batch/Semester)
const checkProfile = (req, res, next) => {
    if (req.user && req.user.needsProfileSetup && req.path !== '/complete-profile' && req.path !== '/logout') {
        return res.redirect('/complete-profile');
    }
    next();
};

module.exports = { protect, admin, checkUser, checkProfile };
