const nodemailer = require("nodemailer")
const otpCollection = require("../models/otpCollection")
const jwt = require("jsonwebtoken")
const env = require("dotenv")

env.config()

exports.mailSender = async (user) => {
    console.log(user)
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            },
        })

        const otpPin = Math.floor((Math.random() * 10000) + 1)
        const otpData = new otpCollection({ email: user.email, otpPin })
        const otpSave = await otpData.save()

        if (otpSave) {
            const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" })
            
            const info = await transporter.sendMail({
                from: process.env.EMAIL,
                to: user.email,
                subject: "OTP Varification Link",
                text: `http://localhost:3000/otp_varification/${token}?otp=${otpPin}&email=${user.email}`
            })

            if (info) return { token, message: "You OTP varification link is send to your email" }
        }
        else {
            return "wrong user credentials"
        }

    } catch (error) {
        console.log(error)
    }
}