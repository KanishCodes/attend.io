const express = require('express');
const router = express.Router();
const { getMarkAttendance, submitAttendance, getTeacherReport } = require('../controllers/attendanceController');
const { protect, admin, checkProfile } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin);
router.use(checkProfile);

router.get('/mark-attendance', getMarkAttendance);
router.get('/teacher-report', getTeacherReport);
router.post('/attendance', submitAttendance);

module.exports = router;
