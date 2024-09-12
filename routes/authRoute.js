const express = require('express')
const authController = require('../Controllers/authController.js');
const {updatePurchaseStatus} = require('../Controllers/courseController.js')
// const courseController = require('../Controllers/courseController')

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login)
router.post('/update-purchase-status', updatePurchaseStatus)
// router.get('/categories', getAllCategories)
// router.get('/categories/:categoryId/courses', getCoursesByCategory)
// router.get('/generateCertificate', generateCertificate)
// router.get('/certificates/:userId', courseController.getUserCertificates);



module.exports = router;