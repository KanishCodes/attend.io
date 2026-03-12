const express = require('express');
const { servePage } = require('../controllers/pageController');
const router = express.Router();
const { readUsers } = require('../utils/fileHandler');

router.get('/', servePage('home'));
router.get('/signup', servePage('signup'));
router.get('/login', servePage('login'));
router.get('/mark-attendance', servePage('mark-attendance'));
router.get('/view-attendance', servePage('view-attendance'));
router.get('/about', servePage('about'));
router.get('/contact', servePage('contact'));

// Profile Route (Using Route Parameter :email)
router.get('/profile/:email', (req, res) => {
    const { email } = req.params;
    const { role = '' } = req.query;
    const users = readUsers();
    const userDetails = users.find(u => u.email === email) || {};
    const fullName = userDetails.lastName ? `${userDetails.firstName} ${userDetails.lastName}` : (userDetails.firstName || 'User');
    res.render('profile', { email, role, userDetails, fullName });
});

module.exports = router;