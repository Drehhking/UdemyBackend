const User = require("../Models/userModel");
const admin = require("../Models/AdminModel");
const Upload = require("../Models/NewCourseModel");
const Category = require("../Models/categoryModel")
const { cloudinary } = require("../Middleware/cloudinary");
require('../.env');
// Upload.schema.add({ isPurchased: { type: Boolean, default: false } });

let getallUsers = async (req, res) => {
  try {
    const user = await User.find();
    if (user) {
      res.status(200).send({ message: "Users retrieved successfully", user, status: "ok" });
    } else {
      res.status(404).send({ message: "Users not found", status: false });
    }
  } catch (err) {
    res.status(500).send({ message: "Internal server error" });
  }
};

let deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const userToDelete = await User.findOneAndDelete({ _id: id });
    if (!userToDelete) {
      res.status(404).send({ message: "User not found", status: false });
    } else {
      res.status(200).send({ message: "User deleted successfully", status: "ok" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal server error", status: false });
  }
};

let uploadCourse = async (req, res) => {
  const {
    courseCategory,
    courseName,
    description,
    creator,
    actualPrice,
    discountedPrice,
    what_you_will_learn,
    what_you_will_learn2,
    what_you_will_learn3,
    what_you_will_learn4,
    what_you_will_learn5,
    image,
    content,
    content2,
    content3,
    content4,
    content5,
    video,
    ratings,
    students,
    stars
  } = req.body;

  if (
    !courseCategory ||
    !courseName ||
    !description ||
    !creator ||
    !actualPrice ||
    !discountedPrice ||
    !what_you_will_learn ||
    !what_you_will_learn2 ||
    !what_you_will_learn3 ||
    !what_you_will_learn4 ||
    !what_you_will_learn5 ||
    !image ||
    !content ||
    !content2 ||
    !content3||
    !content4 ||
    !content5 ||
    !video ||
    !ratings ||
    !students||
    !stars
  ) {
    return res.status(400).send({ message: "A required field is empty", status: false });
  }

  try {
    const findCourse = await Upload.findOne({ courseName });

    if (findCourse) {
      return res.status(400).send({ message: "Course already exists", status: false });
    }
// 
    const [ImageURL, VideoURL] = await Promise.all([
      cloudinary.uploader.upload(image, { folder: "udemy_media" }),
      cloudinary.uploader.upload(video, { folder: "udemy_media", resource_type : 'video' }),
    ]);


    console.log("Image URL:", ImageURL);
    console.log("Video URL:", VideoURL);


// 
 if(ImageURL && VideoURL){
  const createCourse = await Upload.create({
    courseCategory,
    courseName,
    description,
    creator,
    actualPrice,
    discountedPrice,
    what_you_will_learn,
    what_you_will_learn2,
    what_you_will_learn3,
    what_you_will_learn4,
    what_you_will_learn5,
    image: ImageURL.secure_url,
    content,
    content2,
    content3,
    content4,
    content5,
    video: VideoURL.secure_url,
    ratings,
    students,
    stars,
    isPurchased: false, 
  });
  if (!createCourse) {
    return res.status(404).send({ message: "Course cannot be created at the moment", status: false });
  }
  res.status(200).send({ message: "Course created successfully", createCourse, status: "ok" });
 }else{
  console.log('problem');
  
 }
    
  } catch (error) {
    console.error("Error during course upload:", error);
    res.status(500).send({ message: "Internal server error", status: false });
  }
};

// In your courses controller
let getAllCourses = async (req, res) => {
  try {
    const courses = await Upload.find(); // Make sure you are using the correct model
    res.status(200).json({ status: 'success', courses }); // Sending courses as an array
  } catch (err) {
    res.status(500).send({ message: "Internal server error" });
  }
};

const getCourseById = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query; // Fetch userId from the query parameters

  try {
    const course = await Upload.findById(id);
    if (!course) {
      return res.status(404).send({ message: "Course not found", status: false });
    }

    let isPurchased = false;

    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        isPurchased = user.purchasedCourses.includes(id);
      } else {
        return res.status(404).send({ message: "User not found", status: false });
      }
    }

    res.status(200).send({ course, isPurchased, status: "ok" });

  } catch (error) {
    console.error("Error fetching course by ID:", error);
    res.status(500).send({ message: "Internal server error", status: false });
  }
};

let updatePurchaseStatus = async (req, res) => {
  const { courseId, userId } = req.body;

  try {
    const course = await Upload.findById(courseId);
    if (!course) {
      return res.status(404).send({ message: "Course not found", status: false });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found", status: false });
    }

    if (!user.purchasedCourses.includes(courseId)) {
      await User.findByIdAndUpdate(userId, { $push: { purchasedCourses: courseId } });
    }

    res.status(200).send({ message: "Course purchased successfully", status: "ok" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", status: false });
  }
};


// const generateCertificate = async (req, res) => {
  // const { userId, categoryId } = req.body;
// 
  // try {
    // const user = await User.findById(userId);
    // if (!user) {
      // return res.status(404).send({ message: "User not found", status: false });
    // }
// 
    // const coursesInCategory = await Upload.find({ courseCategory: categoryId });
    // if (!coursesInCategory.length) {
      // return res.status(404).send({ message: "No courses in this category", status: false });
    // }
// 
    // const allPurchased = coursesInCategory.every(course => 
      // user.purchasedCourses.includes(course._id)
    // );
// 
    // if (!allPurchased) {
      // return res.status(400).send({ message: "User hasn't completed all courses", status: false });
    // }
// 
    // const certificateId = `CERT-${Date.now()}-${categoryId}`;
    // await User.findByIdAndUpdate(userId, {
      // $push: { certificates: { categoryId, certificateId, date: new Date() } }
    // });
// 
    // res.status(200).send({ message: "Certificate generated", certificateId, status: "ok" });
  // } catch (error) {
    // console.error("Error generating certificate:", error);
    // res.status(500).send({ message: "Internal server error", status: false });
  // }
// };









// Fetch courses by category








module.exports = { getallUsers, deleteUser, uploadCourse, getAllCourses, getCourseById, updatePurchaseStatus };
