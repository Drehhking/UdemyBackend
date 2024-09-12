// authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../Models/userModel'); // Assuming this is your user model

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authorization token missing' });
    }

    const decoded = jwt.verify(token, 'your_secret_key'); // Use your secret key
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token or user not found' });
    }

    req.user = user; // Attach user to request object
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token verification failed' });
  }
};

module.exports = authenticate;
