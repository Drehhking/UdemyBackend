// const mongoose = require('mongoose');

// const categorySchema = new mongoose.Schema({
//     courseCategory: {
//         type: String,
//         required: true,
//         enum: ['Python', 'Web Development', 'Data Science', 'Aws', 'Design', 'Marketing'],
//         // type: mongoose.Schema.Types.ObjectId, // Link to Category model if you're using reference
//         // ref: 'Category', // Reference to the Category model
//         required: true,
//         ref: 'Category'
//     },
//   description: {
//     type: String,
//   },
//   courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Upload' }] // Refers to the 'Course' model
// });

// const Category = mongoose.model('Category', categorySchema); // Use categorySchema here
// module.exports = Category;
// // This code defines a Mongoose model for categories, ensuring that each category has a unique name and can reference courses.