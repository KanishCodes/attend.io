const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    date: {
        type: Date,
        required: true,
        // We normalize the date to the start of the day for uniqueness check
        set: function(val) {
            const d = new Date(val);
            d.setHours(0, 0, 0, 0);
            return d;
        }
    },
    records: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            type: String,
            enum: ['Present', 'Absent'],
            required: true
        }
    }]
}, {
    timestamps: true
});

// VERY IMPORTANT: Prevent marking twice for the same subject on the same date
attendanceSchema.index({ subject: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
