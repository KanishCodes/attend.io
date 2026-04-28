const express = require('express');
const router = express.Router();
const { getMarkAttendance, submitAttendance } = require('../controllers/attendanceController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.get('/mark-attendance', getMarkAttendance);
router.post('/attendance', submitAttendance);

module.exports = router;
