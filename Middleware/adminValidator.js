const jwt = require('jsonwebtoken');
const createError = require('../utils/appError');

exports.protect = async (req, res, next) => {
    try {
        // 1) Getting token and check if it's there
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new createError('You are not logged in! Please log in to get access.', 401));
        }

        // 2) Verification token
        const decoded = jwt.verify(token, 'secretkey123'); // Use your actual secret key here

        // 3) Check if user still exists
        const currentUser = await User.findById(decoded._id);
        if (!currentUser) {
            return next(new createError('The user belonging to this token no longer exists.', 401));
        }

        // 4) Grant access to protected route
        req.user = currentUser;
        next();
    } catch (err) {
        return next(new createError('Authentication failed. Please log in again.', 401));
    }
};
