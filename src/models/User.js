const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: function() { return !this.googleId; } // Password only required if not using Google OAuth
    },
    profilePic: {
        type: String,
        default: '/uploads/default-avatar.png'
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true // Allows multiple nulls for users without Google ID
    },
    role: {
        type: String,
        enum: ['student', 'teacher'],
        required: true
    },
    // Student Specific
    batch: String,
    semester: String,
    program: String,
    group: {
        type: String,
        enum: {
            values: ['G-14', 'G-15', 'G-16'], // We can expand this list easily
            message: '{VALUE} is not a valid group'
        },
        required: function() { return this.role === 'student'; }
    },
    // Teacher Specific
    department: String,
    designation: String
}, {
    timestamps: true
});

// Index for fast student lookups within a group
userSchema.index({ group: 1, role: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
