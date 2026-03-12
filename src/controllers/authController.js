const { readUsers, writeUsers } = require('../utils/fileHandler');

const registerUser = (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;
    const users = readUsers();
    
    // Check for mandatory fields
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).render('auth-error', { 
            message: "Missing mandatory fields (Email, Name, or Password).", 
            linkText: "Fix & Try Again", 
            linkUrl: "/signup" 
        });
    }

    // Check if passwords match
    if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).render('auth-error', { 
            message: "Passwords do not match!", 
            linkText: "Fix Passwords", 
            linkUrl: "/signup" 
        });
    }

    // Check if email already exists
    if (users.find(u => u.email === req.body.email)) {
        return res.status(400).render('auth-error', { 
            message: "An account with this email already exists.", 
            linkText: "Try Signing Up Again", 
            linkUrl: "/signup" 
        });
    }

    // Cleanup and filter fields based on role
    const userData = { ...req.body };
    delete userData.confirmPassword;

    if (role === 'teacher') {
        delete userData.batch;
        delete userData.semester;
        delete userData.program;
        delete userData.group;
    } else if (role === 'student') {
        delete userData.department;
        delete userData.designation;
    }

    // Capture filtered fields and save
    users.push(userData);
    writeUsers(users);

    res.render('auth-error', { 
        message: `Registered successfully as ${userData.role} (${userData.firstName} ${userData.lastName})`, 
        linkText: "Go to Login", 
        linkUrl: "/login" 
    });
};

const loginUser = (req, res) => {
    const { email, password } = req.body;
    const users = readUsers();

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Redirect based on role
        if (user.role === "teacher") {
            res.redirect(`/mark-attendance?email=${encodeURIComponent(user.email)}&role=teacher`);
        } else {
            res.redirect(`/view-attendance?email=${encodeURIComponent(user.email)}&role=student`);
        }
    } else {
        res.status(401).render('auth-error', { 
            message: "Invalid email or password...!!", 
            linkText: "Try Logging In Again", 
            linkUrl: "/login" 
        });
    }
};

module.exports = { registerUser, loginUser };