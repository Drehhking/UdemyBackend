const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    courseCategory: {
        type:  String,
        required: true,
        enum: ['Python', 'Web Development', 'Data Science', 'Aws', 'Design', 'Marketing'],
        // type: mongoose.Schema.Types.ObjectId, // Link to Category model if you're using reference
        // ref: 'Category', // Reference to the Category model
        required: true
    },
    courseName: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    creator: {
        type: String,
        required: true
    },
    actualPrice: {
        type: Number,
        required: true
    },
    discountedPrice: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    content2: {
        type: String,
        required: true
    },
    content3: {
        type: String,
        required: true
    },
    content4: {
        type: String,
        required: true
    },
    content5: {
        type: String,
        required: true
    },
    what_you_will_learn: {
        type: String,
        required: true
    },
    what_you_will_learn2: {
        type: String,
        required: true
    },
    what_you_will_learn3: {
        type: String,
        required: true
    },
    what_you_will_learn4: {
        type: String,
        required: true
    },
    what_you_will_learn5: {
        type: String,
        required: true
    },
    
    image: {
        type: String,
        required: true
    },
    video: {
        type: String,
        required: true,
        default: null,
        // playable: false
    },
    ratings: {
        type: String,
        required: true
    },
    students: {
        type: String,
        required: true
    },
    stars: {
        type: String,
        required: true
    },
    isPurchased: { type: Boolean, default: false },
})

const Upload = mongoose.model('Upload', courseSchema);
module.exports = Upload;