const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
        const newUser = {
            googleId: profile.id,
            firstName: profile.name.givenName || 'User',
            lastName: profile.name.familyName || '(No Last Name)', // Fallback if Google account has no last name
            email: profile.emails[0].value,
            profilePic: profile.photos[0].value,
            role: 'student', // Default role for Google signup
            group: 'G-14' // Default group to pass student schema validation
        };

        try {
            // First, try to find the user by their Google ID
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                // User already has their Google account linked
                return done(null, user);
            }

            // If not found by Google ID, check if they signed up with this email manually before
            user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                // Email exists, but not linked to Google yet. Let's link them!
                user.googleId = profile.id;
                
                // If they don't have a profile picture yet, use the Google one
                if (user.profilePic === '/uploads/default-avatar.png' && profile.photos && profile.photos[0]) {
                    user.profilePic = profile.photos[0].value;
                }
                
                await user.save();
                return done(null, user);
            }

            // If no email matches, create a brand new account
            user = await User.create(newUser);
            done(null, user);
        } catch (err) {
            console.error(err);
            done(err, null);
        }
    }));

    // Required for passport session support
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};
