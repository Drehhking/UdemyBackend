const express = require("express")
const { getallUsers, deleteUser, uploadCourse, getAllCourses, getCourseById, updatePurchaseStatus } = require("../Controllers/courseController")



const router = express.Router();




const adminrouter = express.Router()

adminrouter.get("/getusers", getallUsers)
adminrouter.get("/deleteUser/:id", deleteUser)
adminrouter.post("/uploadCourses", uploadCourse)
adminrouter.get('/courses', getAllCourses);
adminrouter.get('/courses/:id', getCourseById);
adminrouter.get('/update-purchase-status', updatePurchaseStatus)
 // Import the middleware
// Example route that requires authentication

module.exports = adminrouter