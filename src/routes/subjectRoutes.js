const express = require('express');
const router = express.Router();
const { getManageSubjects, addSubject, deleteSubject } = require('../controllers/subjectController');
const { protect, admin } = require('../middleware/authMiddleware');

// All subject routes require being logged in and being a teacher
router.use(protect);
router.use(admin);

router.get('/manage-subjects', getManageSubjects);
router.post('/subjects', addSubject);
router.post('/subjects/delete/:id', deleteSubject);

module.exports = router;
