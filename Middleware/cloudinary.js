const cloudinary = require('cloudinary').v2
require('dotenv').config()
const express = require('express');
const app = express();

const cloudinaryConfig = cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    timeout: 600000 
})


module.exports = { cloudinary, cloudinaryConfig }