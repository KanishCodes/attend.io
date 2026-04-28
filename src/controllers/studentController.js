const Subject = require('../models/Subject');
const Attendance = require('../models/Attendance');

// @desc    Get attendance report for the logged in student
// @route   GET /view-attendance
const getStudentAttendance = async (req, res) => {
    try {
        // 1. Find all subjects assigned to the student's group
        const subjects = await Subject.find({ group: req.user.group }).populate('faculty');

        // 2. For each subject, calculate the percentage
        const attendanceReport = await Promise.all(subjects.map(async (subject) => {
            // Count total classes held for this subject
            const totalClasses = await Attendance.countDocuments({ subject: subject._id });
            
            // Count classes where this student was "Present"
            const presentClasses = await Attendance.countDocuments({
                subject: subject._id,
                'records.student': req.user._id,
                'records.status': 'Present'
            });

            const percentage = totalClasses > 0 ? ((presentClasses / totalClasses) * 100).toFixed(2) : 0;

            return {
                name: subject.name,
                code: subject.code,
                faculty: subject.faculty ? `${subject.faculty.firstName} ${subject.faculty.lastName}` : 'N/A',
                present: presentClasses,
                total: totalClasses,
                percentage: percentage
            };
        }));

        res.render('view-attendance', {
            report: attendanceReport,
            user: req.user,
            title: 'My Attendance'
        });
    } catch (error) {
        res.status(500).render('auth-error', { message: error.message, linkText: "Try Again", linkUrl: "/view-attendance" });
    }
};

module.exports = { getStudentAttendance };
