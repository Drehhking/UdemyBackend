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
    isPurchased: false
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

let getAllCourses = async (req, res) => {
  try {
    const courses = await Upload.find(); 
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
  console.log("UserDetails", req.body)

  try {
    // Find and update the specific course's purchase status
    const course = await Upload.findById(courseId);
    if (!course) {
      return res.status(404).send({ message: "Course not found", status: false });
    }

    // Find and update the user's purchasedCourses list
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found", status: false });
    }

    if (!user.purchasedCourses.includes(courseId)) {
      // await User.save();
      await User.findByIdAndUpdate(userId, { $push: { purchasedCourses: courseId } });
      // await Upload.findByIdAndUpdate(courseId, { isPurchased: true });

      await Upload.findByIdAndUpdate(courseId, { isPurchased: true });
    }

    // Only update the specific course

    res.status(200).send({ message: "Course purchased successfully", status: "ok" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", status: false });
  }

  // const { courseId, userId } = req.body;

  // try {
  //   // Find the user and update purchased courses
  //   const user = await User.findById(userId);
  //   if (!user) return res.status(404).send({ message: 'User not found' });

  //   // Add course to purchased courses if not already added
  //   if (!user.purchasedCourses.includes(courseId)) {
  //     user.purchasedCourses.push(courseId);
  //     await user.save();

  //     // Update the course's purchase status
  //     await Upload.findByIdAndUpdate(courseId, { isPurchased: true });
  //   }

  //   res.send({ message: 'Course purchased successfully' });
  // } catch (error) {
  //   res.status(500).send({ message: 'Error updating purchase status', error });
  // }


  // try {
  //   const { email, courseId, isPurchased } = req.body;
  //   console.log(req.body)
  
    // Validate input
    // if (!email || !courseId || typeof isPurchased !== 'boolean') {
    //   return res.status(400).json({ message: "Invalid input" });
    // }
  
    // Find user by email
  //   const user = await User.findOne({email});
  //   console.log("Received email:", email);
  //   console.log("Received email:", user);

  //   if (!user) {
  //     console.log("User not found with email:", email); 
  //     return res.status(404).json({ message: "User not found" });
  //   }
  
  //   // Find course in user's courses
  //   const course = user.courses.find(c => c.courseId === courseId);
  //   if (!course) {
  //     return res.status(404).json({ message: "Course not found in user's courses" });
  //   }
  
  //   // Update purchase status
  //   course.isPurchased = isPurchased;
  //   await user.save();

  //   await Upload.findByIdAndUpdate(courseId, { isPurchased: true });
  
  //   return res.status(200).json({ message: "Purchase status updated successfully" });
  // } catch (error) {
  //   console.error("Error updating purchase status:", error); // Log the error for debugging
  //   return res.status(500).json({ message: "Error updating purchase status", error: error.message });
  // }
  
};



const getAllCategories = async (req, res) => {
  try {
    const enumValues = Upload.schema.path('courseCategory').enumValues; // This retrieves all enum values
    res.status(200).json({ status: 'success', categories: enumValues });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};








module.exports = { getallUsers, deleteUser, uploadCourse, getAllCourses, getCourseById, updatePurchaseStatus, getAllCategories };
