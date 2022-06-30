const { userSignup, otpCheck, jwtTokenVarify, userProfile, userLogin, userLogout, userSearch, requestFriend } = require("../controller/userController")

const { validationRequest, ieRequestValidation } = require("../validation/validation")

const router = require("express").Router()

router.post("/user/signup", validationRequest, ieRequestValidation, userSignup)
router.post("/user/login", validationRequest, ieRequestValidation, userLogin)
router.post("/user/signup/otp", otpCheck)
router.get("/user/profile", jwtTokenVarify, userProfile)
router.post("/user/logout", userLogout)
router.get("/user/search/:key/:id", userSearch)
// router.post("/user/friend/request", requestFriend)

module.exports = router