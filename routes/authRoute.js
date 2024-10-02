const express = require('express')
const authController = require('../Controllers/authController.js');
const {updatePurchaseStatus, getAllCategories, getCoursesByCategory } = require('../Controllers/courseController.js')
// const courseController = require('../Controllers/courseController')

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login)
router.post('/update-purchase-status', updatePurchaseStatus)
router.get('/categories', getAllCategories)
router.get('/courses/grouped', getCoursesByCategory);
// router.get('/courses/category/:category', getCoursesByCategory);
// router.get('/user/:userId/purchased-courses', getPurchasedCoursesByUser);


module.exports = router;