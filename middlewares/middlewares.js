"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Custom middleware to check session and redirect
const sessionRouter = (req, res, next) => {
    // Example: Check if user is logged in
    if (!req.session.user) {
        // If not logged in, redirect to login page
        return res.redirect('/login');
    }
    // Example: Check user role and redirect accordingly
    // if (req.session.user.name === 'admin') {
    //   return res.redirect('/admin');
    // } else if (req.session.user.role === 'user') {
    //   return res.redirect('/dashboard');
    // }
    // If no conditions are met, proceed to the next middleware/route
    next();
};
