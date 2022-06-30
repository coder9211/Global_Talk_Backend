const { check, validationResult } = require("express-validator")

exports.validationRequest = [
    check("email").isEmail().withMessage("valid email is required"),
    check("password").isLength({ min: 10}).withMessage("your password length is must be greater than or equal to 10")
]

exports.ieRequestValidation = (req, res, next) =>{
    const error = validationResult(req) 
    if(error.array().length > 0){
        return res.status(400).json({error: error.array()[0].msg})
    }
    next()
}