const mongoose = require('mongoose')

const AdminModelSchema = new mongoose.Schema({
    adminName: String,
    adminEmail: String,
    adminPassword: String
})

const AdminModel = mongoose.model("admin", AdminModelSchema)
module.exports = AdminModel