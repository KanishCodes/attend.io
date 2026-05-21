const Subject = require('../models/Subject');
const Attendance = require('../models/Attendance');

/**
 * Student Controller
 * Handles fetching and calculating attendance data for the student dashboard.
 */

const getStudentAttendance = async (req, res) => {
    try {
        // Step 1: Find all subjects that belong to this student's group (e.g. G-14)
        const subjects = await Subject.find({ group: req.user.group }).populate('faculty');

        const attendanceReport = [];

        // Step 2: Loop through each subject to calculate the student's attendance percentage
        for (const subject of subjects) {
            
            // Find all attendance records for this specific subject
            const allSessions = await Attendance.find({ subject: subject._id }).sort({ date: 1 });
            
            let presentCount = 0;
            const totalSessions = allSessions.length;
            const history = [];

            // Step 3: Loop through each session to see if the student was 'Present' or 'Absent'
            for (const session of allSessions) {
                // Find this specific student's record in the session's array of records
                const studentRecord = session.records.find(r => r.student.toString() === req.user._id.toString());
                const status = studentRecord ? studentRecord.status : 'Absent';
                
                if (status === 'Present') presentCount++;

                // Format the record for display in the view
                history.push({
                    date: session.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    status: status
                });
            }

            // Step 4: Calculate the final percentage
            const percentage = totalSessions > 0 ? ((presentCount / totalSessions) * 100).toFixed(2) : "0.00";

            // Push the processed data into our final report array
            attendanceReport.push({
                name: subject.name,
                code: subject.code,
                faculty: subject.faculty ? `${subject.faculty.firstName} ${subject.faculty.lastName}` : 'N/A',
                present: presentCount,
                total: totalSessions,
                percentage: percentage,
                history: history
            });
        }

        // Step 5: Render the view with the calculated report
        res.render('view-attendance', {
            report: attendanceReport,
            user: req.user,
            title: 'My Attendance'
        });

    } catch (error) {
        console.error("Report Error:", error);
        res.status(500).render('auth-error', { 
            message: "Could not generate attendance report: " + error.message, 
            linkText: "Try Again", 
            linkUrl: "/view-attendance" 
        });
    }
};

module.exports = { getStudentAttendance };
