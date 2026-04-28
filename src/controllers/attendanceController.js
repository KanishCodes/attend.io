const Subject = require('../models/Subject');
const User = require('../models/User');
const Attendance = require('../models/Attendance');

// @desc    Show page to select subject or mark students
// @route   GET /mark-attendance
const getMarkAttendance = async (req, res) => {
    try {
        const subjects = await Subject.find({ faculty: req.user._id });
        const { subjectId } = req.query;

        let students = [];
        let selectedSubject = null;

        if (subjectId) {
            selectedSubject = await Subject.findOne({ _id: subjectId, faculty: req.user._id });
            if (selectedSubject) {
                // Fetch only students who belong to the subject's group
                students = await User.find({ group: selectedSubject.group, role: 'student' }).sort({ firstName: 1 });
            }
        }

        res.render('mark-attendance', {
            subjects,
            selectedSubject,
            students,
            user: req.user,
            title: 'Mark Attendance'
        });
    } catch (error) {
        res.status(500).render('auth-error', { message: error.message, linkText: "Go Back", linkUrl: "/mark-attendance" });
    }
};

// @desc    Submit attendance records
// @route   POST /attendance
const submitAttendance = async (req, res) => {
    try {
        const { subjectId, date, attendanceData } = req.body;

        if (!subjectId || !date || !attendanceData) {
            throw new Error("Missing attendance data.");
        }

        // Format data for MongoDB
        // attendanceData comes as an object { studentId: "Present/Absent" }
        const records = Object.keys(attendanceData).map(studentId => ({
            student: studentId,
            status: attendanceData[studentId]
        }));

        await Attendance.create({
            subject: subjectId,
            date: new Date(date),
            records
        });

        res.render('auth-error', { 
            message: "Attendance marked successfully!", 
            linkText: "Mark More", 
            linkUrl: "/mark-attendance" 
        });
    } catch (error) {
        // Handle duplicate index error (Teacher trying to mark twice for same day)
        if (error.code === 11000) {
            return res.status(400).render('auth-error', { 
                message: "Attendance already marked for this subject on this date!", 
                linkText: "Change Date/Subject", 
                linkUrl: "/mark-attendance" 
            });
        }
        res.status(400).render('auth-error', { message: error.message, linkText: "Go Back", linkUrl: "/mark-attendance" });
    }
};

module.exports = { getMarkAttendance, submitAttendance };
