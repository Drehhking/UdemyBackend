const express = require("express")
const mongoose = require("mongoose")
const cors = require('cors')
const bcrypt = require('bcrypt');
const authRouter = require('./routes/authRoute')
const AdminModel = require('./Models/AdminModel');
const adminrouter = require("./routes/adminroutes");
require('dotenv').config()
// const bodyParser = require('body-parser')

const app = express();

// 1) MIDDLEWARES
app.use(cors({origin:"*"}))

app.use(express.urlencoded({extended:true, limit:"100mb"}))
app.use(express.json({limit:"100mb"}))

app.use('/api/auth', authRouter)
app.use('/api/admin', adminrouter)
app.use('./uploadCourses', adminrouter)

// 3) MONGO DB CONNECTION
mongoose.connect('mongodb+srv://ahmedrichard617:emmanuel_124@cluster0.8n5mtya.mongodb.net/node_class?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log("connected to mongodb!"))
  .catch((error) => {
    console.error("Failed to connect to mongoDB:", error)
    process.exit(1) // exit the application if connection fails
  })

// 4) GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  })
})




// Admin Login Route
app.post("/adminLogin", async (req, res) => {
  try {
    const { adminEmail, adminPassword } = req.body;
    if (!adminEmail || !adminPassword) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await AdminModel.findOne({ adminEmail });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isValid = await bcrypt.compare(adminPassword, admin.adminPassword);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.json("Success");
  } catch (err) {
    res.status(500).json({ message: 'Error logging in admin', error: err });
  }
});

// Admin Signup Route
app.post('/adminSignup', async (req, res) => {
  try {
    const { adminEmail, adminPassword } = req.body;
    if (!adminEmail || !adminPassword) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingAdmin = await AdminModel.findOne({ adminEmail });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const admin = new AdminModel({ adminEmail, adminPassword: hashedPassword });
    const newAdmin = await admin.save();
    res.json(newAdmin);
  } catch (err) {
    res.status(500).json({ message: 'Error creating admin', error: err });
  }
})

// 5) SERVER
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
})