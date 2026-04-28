const express = require('express');
const passport = require('passport');
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');
const upload = require('../middleware/upload');
const generateToken = require('../utils/generateToken');
const router = express.Router();

router.post('/signup', upload.single('profilePic'), registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);

// Google Auth Routes
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication
        // Generate our JWT token for the Google User
        generateToken(res, req.user._id);
        
        // Redirect based on role
        if (req.user.role === 'teacher') {
            res.redirect('/mark-attendance');
        } else {
            res.redirect('/view-attendance');
        }
    }
);

module.exports = router;