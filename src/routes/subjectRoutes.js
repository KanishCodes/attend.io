const express = require('express');
const router = express.Router();
const { getManageSubjects, addSubject, deleteSubject } = require('../controllers/subjectController');
const { protect, admin, checkProfile } = require('../middleware/authMiddleware');

// All subject routes require being logged in, being a teacher, and having a complete profile
router.use(protect);
router.use(admin);
router.use(checkProfile);

router.get('/manage-subjects', getManageSubjects);
router.post('/subjects', addSubject);
router.post('/subjects/delete/:id', deleteSubject);

module.exports = router;
