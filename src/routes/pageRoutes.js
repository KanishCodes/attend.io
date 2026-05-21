const express = require('express');
const { servePage } = require('../controllers/pageController');
const { getStudentAttendance } = require('../controllers/studentController');
const { postCompleteProfile, updateProfilePicture } = require('../controllers/authController');
const { protect, admin, checkUser, checkProfile } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const router = express.Router();

// Public Routes
router.get('/', checkUser, servePage('home'));
router.get('/signup', checkUser, servePage('signup'));
router.get('/login', checkUser, servePage('login'));
router.get('/about', checkUser, servePage('about'));
router.get('/contact', checkUser, servePage('contact'));

// Profile Completion Routes
router.get('/complete-profile', protect, servePage('complete-profile'));
router.post('/complete-profile', protect, upload.single('profilePic'), postCompleteProfile);

// Protected Routes (Now with checkProfile!)
router.get('/view-attendance', protect, checkProfile, getStudentAttendance);

// Secure Profile Route
router.get('/profile', protect, checkProfile, (req, res) => {
    res.render('profile', { 
        userDetails: req.user, 
        fullName: `${req.user.firstName} ${req.user.lastName}`,
        role: req.user.role,
        user: req.user 
    });
});

router.post('/profile/update-picture', protect, upload.single('profilePic'), updateProfilePicture);

module.exports = router;