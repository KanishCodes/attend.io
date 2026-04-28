const express = require('express');
const { servePage } = require('../controllers/pageController');
const { getStudentAttendance } = require('../controllers/studentController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Public Routes
router.get('/', servePage('home'));
router.get('/signup', servePage('signup'));
router.get('/login', servePage('login'));
router.get('/about', servePage('about'));
router.get('/contact', servePage('contact'));

// Protected Routes
router.get('/view-attendance', protect, getStudentAttendance);

// Secure Profile Route (No email in URL!)
router.get('/profile', protect, (req, res) => {
    res.render('profile', { 
        userDetails: req.user, 
        fullName: `${req.user.firstName} ${req.user.lastName}`,
        role: req.user.role
    });
});

module.exports = router;