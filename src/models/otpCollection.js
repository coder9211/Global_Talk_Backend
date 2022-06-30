const mongoose = require("mongoose")

const otpSchema = mongoose.Schema({
    email: String,
    otpPin: String,
    createdAt: { type: Date, expires: '10m', default: Date.now }
}, { timestamps: true})

module.exports = mongoose.model("otpPin", otpSchema)