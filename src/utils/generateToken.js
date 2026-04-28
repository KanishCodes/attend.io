const jwt = require('jsonwebtoken');

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d' // Token valid for 30 days
    });

    // Set JWT as an HTTP-Only Cookie
    res.cookie('jwt', token, {
        httpOnly: true, // Prevent XSS attacks (JS can't access it)
        secure: process.env.NODE_ENV === 'production', // Use secure cookies only in production
        sameSite: 'lax', // Must be lax for OAuth redirects to work correctly
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
    });
};

module.exports = generateToken;
