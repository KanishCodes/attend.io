const express = require('express');
const path = require('path');
const logger = require('./middleware/logger');
const pageRoutes = require('./routes/pageRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = 3000;

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '../views')); // Explicitly setting views dir

// Middleware to read form data from your pages or Postman
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(logger);

// Routes
app.use('/', pageRoutes);
app.use('/', authRoutes);

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