const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        trim: true,
        required: true,
    },
    userName: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        index: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    varifiedEmail:{
        type: Boolean,
        enum: [true, false],
        default: false
    },
    password: {
        type: String,
        required: true,
    },
    mobileNo: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    profilePicture: {
        type: String,
        default: ""
    },
    socketId:{
        type: String,
        default: ""
    },
    friendRequest: {
        type: Array,
        default: []
    },
    friends: {
        type: Array,
        default: []
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
}, { timestamps: true  })

userSchema.pre("save", async function (next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12)
    }
    next()
})

module.exports =  mongoose.model("users", userSchema)