const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subject name is required'],
        trim: true
    },
    code: {
        type: String,
        required: [true, 'Subject code is required'],
        trim: true
    },
    group: {
        type: String,
        enum: ['G-14', 'G-15', 'G-16'],
        required: [true, 'Target group is required']
    },
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Indexes for fast searching by teacher or group
subjectSchema.index({ faculty: 1 });
subjectSchema.index({ group: 1 });

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
