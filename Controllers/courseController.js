const User = require("../Models/userModel");
const admin = require("../Models/AdminModel");
const Upload = require("../Models/NewCourseModel");
const Category = require("../Models/categoryModel")
const { cloudinary } = require("../Middleware/cloudinary");
require('../.env');

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

// Fetch all courses by category


const getCoursesByCategory = async (req, res) => {
  console.log(req.body)
  const { category } = req.body;

  try {
    // Fetch the enum values to validate the category
    const validCategories = Upload.schema.path('courseCategory').enumValues;

    if (!validCategories.includes(category)) {
      return res.status(400).json({ status: 'error', message: 'Invalid category' });
    }

    // Fetch courses by the category
    const courses = await Upload.find({ courseCategory: category });

    if (!courses || courses.length === 0) {
      return res.status(404).json({ status: 'error', message: 'No courses found in this category' });
    }

    res.status(200).json({ status: 'success', courses });
  } catch (error) {
    console.error('Error fetching courses by category:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const uploadProfileImage = async (req, res) => {
  const { userId } = req.body; // Replace with `email` if needed
  const { image } = req.body; // The base64 image string from the client

  if (!userId || !image) {
    return res.status(400).json({ message: "User ID or image is missing", status: false });
  }

  try {
    // Find the user by ID
    const user = await User.findById(userId); // Replace with `findOne({ email })` if you're using email
    if (!user) {
      return res.status(404).json({ message: "User not found", status: false });
    }

    // Upload the image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(image, {
      folder: "user_profiles", // Store images in a specific folder
    });

    // Update the user's profile with the new image URL
    user.profileImage = uploadedImage.secure_url;
    await user.save();

    res.status(200).json({
      message: "Profile image uploaded successfully",
      profileImage: uploadedImage.secure_url,
      status: "ok",
    });
  } catch (error) {
    console.error("Error uploading profile image:", error);
    res.status(500).json({ message: "Internal server error", status: false });
  }
};

const purchasedCourses = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate("purchasedCourses"); // Use populate if you store references
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user.purchasedCourses);
  } catch (error) {
    console.error("Error fetching purchased courses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const certificationPage = async (req, res) => {
  try {
    const userId = req.user.id; // Replace with your auth middleware logic
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const allCourses = await Upload.find();
    if (!allCourses) {
      return res.status(404).json({ error: "Courses not found" });
    }

    const purchasedCourseIds = Array.isArray(user.purchasedCourses)
      ? user.purchasedCourses.map(id => id.toString())
      : [];

    console.log("All Courses:", allCourses.map(course => course._id.toString()));
    console.log("Purchased Courses:", purchasedCourseIds);

    const isEligible = allCourses.every(course =>
      purchasedCourseIds.includes(course._id.toString())
    );

    console.log("Eligibility Check:", isEligible);

    if (isEligible) {
      return res.json({
        isEligible: true,
        userDetails: {
          name: user.name,
          completionDate: new Date().toLocaleDateString(),
        },
      });
    } else {
      return res.status(400).json({
        error: "You are not eligible to obtain a certificate until you purchase all courses.",
      });
    }
  } catch (error) {
    console.error("Error in certificationPage:", error);
    res.status(500).json({ error: "Server error" });
  }
};






module.exports = { getallUsers, deleteUser, uploadCourse, getAllCourses, getCourseById, updatePurchaseStatus, getAllCategories, getCoursesByCategory, uploadProfileImage, purchasedCourses, certificationPage};
