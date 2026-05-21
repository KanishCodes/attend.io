const Subject = require('../models/Subject');
const User = require('../models/User');
const Attendance = require('../models/Attendance');

// @desc    Show page to select subject or mark students
// @route   GET /mark-attendance
const getMarkAttendance = async (req, res) => {
    try {
        const subjects = await Subject.find({ faculty: req.user._id });
        const { subjectId, date } = req.query;

        let students = [];
        let selectedSubject = null;
        let existingRecords = {};
        
        // Use provided date or default to today
        const queryDate = date ? new Date(date) : new Date();
        const dateString = queryDate.toISOString().split('T')[0];

        if (subjectId) {
            selectedSubject = await Subject.findOne({ _id: subjectId, faculty: req.user._id });
            if (selectedSubject) {
                // Fetch only students who belong to the subject's group
                students = await User.find({ group: selectedSubject.group, role: 'student' }).sort({ firstName: 1 });
                
                // Check if attendance already exists for this date
                const normalizedDate = new Date(dateString);
                normalizedDate.setHours(0, 0, 0, 0);
                
                const attendance = await Attendance.findOne({ 
                    subject: subjectId, 
                    date: normalizedDate 
                });
                
                if (attendance) {
                    // Convert records to a map for easy lookup in EJS
                    attendance.records.forEach(record => {
                        existingRecords[record.student.toString()] = record.status;
                    });
                }
            }
        }

        res.render('mark-attendance', {
            subjects,
            selectedSubject,
            students,
            existingRecords,
            dateString,
            user: req.user,
            title: 'Mark Attendance'
        });
    } catch (error) {
        res.status(500).render('auth-error', { message: error.message, linkText: "Go Back", linkUrl: "/mark-attendance" });
    }
};

// @desc    Submit or Update attendance records
// @route   POST /attendance
const submitAttendance = async (req, res) => {
    try {
        const { subjectId, date, attendanceData } = req.body;

        if (!subjectId || !date || !attendanceData) {
            throw new Error("Missing attendance data.");
        }

        // Format data for MongoDB
        const records = Object.keys(attendanceData).map(studentId => ({
            student: studentId,
            status: attendanceData[studentId]
        }));

        const normalizedDate = new Date(date);
        normalizedDate.setHours(0, 0, 0, 0);

        // Use findOneAndUpdate with upsert to either create new or update existing
        await Attendance.findOneAndUpdate(
            { subject: subjectId, date: normalizedDate },
            { records },
            { upsert: true, new: true, runValidators: true }
        );

        res.render('auth-error', { 
            message: "Attendance saved successfully! You can edit it again anytime.", 
            linkText: "Back to Dashboard", 
            linkUrl: `/mark-attendance?subjectId=${subjectId}&date=${date}` 
        });
    } catch (error) {
        res.status(400).render('auth-error', { message: error.message, linkText: "Go Back", linkUrl: "/mark-attendance" });
    }
};

// @desc    Show overall attendance report for a teacher's subjects
// @route   GET /teacher-report
const getTeacherReport = async (req, res) => {
    try {
        const subjects = await Subject.find({ faculty: req.user._id });
        const { subjectId } = req.query;

        let studentStats = [];
        let selectedSubject = null;

        if (subjectId) {
            selectedSubject = await Subject.findOne({ _id: subjectId, faculty: req.user._id });
            if (selectedSubject) {
                // Find all students in this group
                const students = await User.find({ group: selectedSubject.group, role: 'student' }).sort({ firstName: 1 });
                
                // Get all attendance sessions for this subject
                const totalSessions = await Attendance.countDocuments({ subject: subjectId });

                for (const student of students) {
                    const presentCount = await Attendance.countDocuments({
                        subject: subjectId,
                        records: { $elemMatch: { student: student._id, status: 'Present' } }
                    });

                    studentStats.push({
                        name: `${student.firstName} ${student.lastName}`,
                        email: student.email,
                        present: presentCount,
                        total: totalSessions,
                        percentage: totalSessions > 0 ? ((presentCount / totalSessions) * 100).toFixed(2) : "0.00"
                    });
                }
            }
        }

        res.render('teacher-report', {
            subjects,
            selectedSubject,
            studentStats,
            user: req.user,
            title: 'Class Report'
        });
    } catch (error) {
        res.status(500).render('auth-error', { message: error.message, linkText: "Go Back", linkUrl: "/mark-attendance" });
    }
};

module.exports = { getMarkAttendance, submitAttendance, getTeacherReport };
