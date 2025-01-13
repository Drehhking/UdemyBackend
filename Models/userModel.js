const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
    },
    password: {
        type: String,
        required : true,
    },
    purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] ,// Store purchased course IDs
    certificationIssued: {
        issuedAt: Date,
        courseIds: [mongoose.Schema.Types.ObjectId], // IDs of courses required for certification at the time
      },
    profileImage: {
        type: String,
        default: "", // Default to an empty string if no image is uploaded
      },
});

const User = mongoose.model('User', userSchema);

module.exports = User;