const userCollection = require("../models/userCollection")
const otpCollection = require("../models/otpCollection")
const { mailSender } = require("../utils/mailer")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

exports.userSignup = async (req, res) => {
    const { fullName, userName, email, password, mobileNo } = req.body
    try {
        const userFind = await userCollection.findOne({ email })
        if (userFind) {
            if (userFind.varifiedEmail) return res.status(400).json({ error: "user exist already" })

            const mailData = await mailSender(userFind)
            if (mailData) {
                res.cookie("user_token", mailData.token, { expiresIn: "1d", httpOnly: true })
                return res.status(200).json({ message: mailData.message, userFind })
            }
        } else {
            const newUser = new userCollection({ fullName, userName, email, password, mobileNo })
            const saveUser = await newUser.save()

            if (saveUser) {
                const mailData = await mailSender(saveUser)
                if (mailData) {
                    res.cookie("user_token", mailData.token, { expiresIn: "1d", httpOnly: true })
                    return res.status(200).json({ message: mailData.message, saveUser })
                }
            }else return res.status(400).json({ error: "this username is not available!"})
        }
    } catch (error) {
        return res.status(400).json({ error })
    }
}

exports.otpCheck = async (req, res) => {
    try {
        const { otpPin, email } = req.body
        const otpFind = await otpCollection.findOne({ email })
        if (otpFind) {
            if (otpFind.otpPin === otpPin) {
                const varifiedUser = await userCollection.findOneAndUpdate({ email }, { $set: { "varifiedEmail": true } })
                if (varifiedUser) {
                    return res.status(200).json({ message: "Welcome To Our Global Talk" })
                }
            }
        } else {
            return res.status(400).json({ error: "Your OTP is not matched!" })
        }
    } catch (error) {
        return res.status(400).json({ error })
    }
}

exports.userLogin = async (req, res) => {
    console.log(req.body)
    const { email, password } = req.body
    try {
        const userLogin = await userCollection.findOne({ email })
        if(userLogin){
            passwordMatch = bcrypt.compare(password, userLogin.password)
            if(passwordMatch){
                console.log("Hello")
                const token = jwt.sign({_id: userLogin._id, role: userLogin.role}, process.env.JWT_SECRET_KEY, { expiresIn: "1d" })
                res.cookie("user_token",token, { expiresIn: "1d", httpOnly: true})
                return res.status(200).json({ message: "user login successfully"})
            }
            else{
                return res.status(400).json({ error: "Wrong credentials!"})
            }
        }
        else{
            return res.status(400).json({ error: "Wrong credentials!"})
        }
    } catch (error) {
        res.status(400).json({ error })
    }
}

exports.userProfile = async (req, res) => {
    try{
        userData = await userCollection.findOne({ _id: req.user._id})
        if(userData) return res.status(200).json({ user: userData })
        return res.status(400).json({ error: "something gone wrong in your profile!"})
    }catch(error){
        return res.status(400).json({ error })
    }
}

exports.jwtTokenVarify = (req, res, next) => {
    console.log(req.cookies)
    const token = req.cookies["user_token"]
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY)
    console.log(user)
    req.user = user
    next()
}

exports.userLogout = (req, res) => {
    res.clearCookie("user_token");
    res.status(200).json({message: "user logout successfully"})
}

exports.userSearch = async (req, res) => {
    const regex = new RegExp(req.params.key)
    const id = req.params.id
    const userSearch = await userCollection.find({
        "$or":[{"fullName": {"$regex": regex}},{"userName": {"$regex": regex}}],
        _id: { "$ne": id }
    }) 
    if(userSearch) return res.status(200).json({ userSearch })
}

exports.requestFriend = async (req, res) => {
    try{
        
    }catch(error){
        return res.status(400).json({ error })
    }
}