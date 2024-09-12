const User = require("../Models/userModel")
const admin = require("../Models/AdminModel")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const createError = require('../utils/appError')

// REGISTER USER
exports.signup = async (req, res, next) =>{
    try {
        const user  = await User.findOne({email: req.body.email})

        if (user) {
            return next(new createError('user already exists', 400))
        }
        const hashedpassword = await bcrypt.hash(req.body.password, 12);

        if (!hashedpassword) {
            console.log('error hashing password');

        }else{
          
            const newUser = await User.create({
                ...req.body,
                password: hashedpassword,
            })
    //Assign JWT (json web token) to user
    const token = jwt.sign({_id: newUser._id}, 'secretkey123', {
        expiresIn:"90d"
    });
    res.status(201).json({
        status: 'success',
        message: 'user registered successfully',
        token,
        user: {
            _id : newUser._id,
            name : newUser.name,
            email : newUser.email,
            role: newUser.role,
        }
    })
        }
    
    }catch (error) {
        next(error);
    }
};
exports.login = async (req, res, next) =>{
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if(!user) return next(new createError("User not found", 404));

        const ispasswordValid = await bcrypt.compare(password, user.password)

        if (!ispasswordValid) {
            return next(new createError("Incorrect email or password", 401))
        }

        const token = jwt.sign({_id:  user._id}, 'secretkey123', {
            expiresIn:"90d"
        });

        res.status(200).json({
            status : 'success',
            token,
            message: "logged in successfully",
            user: {
                _id : user._id,
                name : user.name,
                email : user.email,
                role: user.role,
                purchasedCourses: user.purchasedCourses
            }
        })
    }catch (error) {
        next(error)
    }
};

