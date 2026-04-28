const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword, role } = req.body;

        // 1. Basic Validation
        if (!firstName || !lastName || !email || !password || !role) {
            return res.status(400).render('auth-error', { 
                message: "Missing mandatory fields.", 
                linkText: "Fix & Try Again", 
                linkUrl: "/signup" 
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).render('auth-error', { 
                message: "Passwords do not match!", 
                linkText: "Fix Passwords", 
                linkUrl: "/signup" 
            });
        }

        // 2. Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).render('auth-error', { 
                message: "An account with this email already exists.", 
                linkText: "Login Instead", 
                linkUrl: "/login" 
            });
        }

        // 3. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Handle Profile Picture
        let profilePicPath = '/uploads/default-avatar.png';
        if (req.file) {
            profilePicPath = `/uploads/${req.file.filename}`;
        }

        // 5. Prepare User Data
        const userData = {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
            profilePic: profilePicPath,
            // Capture additional fields based on role
            ...(role === 'student' && {
                batch: req.body.batch,
                semester: req.body.semester,
                program: req.body.program,
                group: req.body.group
            }),
            ...(role === 'teacher' && {
                department: req.body.department,
                designation: req.body.designation
            })
        };

        // 6. Save to MongoDB
        const user = await User.create(userData);

        // 7. Generate Token and set Cookie
        generateToken(res, user._id);

        res.render('auth-error', { 
            message: `Registered successfully as ${role}!`, 
            linkText: "Go to Dashboard", 
            linkUrl: role === 'teacher' ? '/mark-attendance' : '/view-attendance'
        });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).render('auth-error', { 
            message: "Server Error during registration: " + error.message, 
            linkText: "Try Again", 
            linkUrl: "/signup" 
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find User
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Generate Token
            generateToken(res, user._id);

            // Redirect based on role (Clean URL)
            if (user.role === "teacher") {
                res.redirect('/mark-attendance');
            } else {
                res.redirect('/view-attendance');
            }
        } else {
            res.status(401).render('auth-error', { 
                message: "Invalid email or password.", 
                linkText: "Try Again", 
                linkUrl: "/login" 
            });
        }
    } catch (error) {
        res.status(500).render('auth-error', { 
            message: "Login Error: " + error.message, 
            linkText: "Try Again", 
            linkUrl: "/login" 
        });
    }
};

const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.redirect('/login');
};

module.exports = { registerUser, loginUser, logoutUser };