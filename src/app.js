require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('./middleware/logger');
const pageRoutes = require('./routes/pageRoutes');
const authRoutes = require('./routes/authRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const session = require('express-session');
const passport = require('passport');
const connectDB = require('./config/db');

// Load Passport Config
require('./config/passport')(passport);

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '../views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Express Session (Required for Passport)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, '../public')));
app.use(logger);

// Routes
app.use('/', pageRoutes);
app.use('/', authRoutes);
app.use('/', subjectRoutes);
app.use('/', attendanceRoutes);

// 404 Error Handler for wrong URLs (Must be at the end)
app.use((req, res) => {
    res.status(404).render('404', { title: '404 - Not Found' });
});

// Error-handling middleware (Required by syllabus)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('<h1>500 - Server Error</h1><p>Something went wrong on our end.</p>');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});