import mongoose  from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim:true,
        index: true
    },
    email:{
         type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim:true
    },
    fullName:{
        type: String,
       required: true,
        lowercase: true,
        trim:true,
        index: true
    },
    avathar: {
        type: String, //cloudinary
        required: true,
    },
    coverImage: {
        type: String, //cloudinary
       
    },
    watchHistory:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }],
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    refreshTokens: {
        type: String,
    }
},{timestamps:true})

userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password,10);
    next()
})

userSchema.methods.passwordCheck = async function(password){
    return await bcrypt.compare(password,this.password);
}
userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id : this._id,
        email : this.email,
        fullName : this.fullName,
        userName: this.userName
    },
process.env.ACCESS_TOCKEN_SECRATE,{
    expiresIn: process.env.ACCESS_TOCKEN_EXPIER
}

)
}
userSchema.methods.generateRequiredToken = function(){
    return jwt.sign({
        _id : this._id
    },
    process.env.REQUIRED_TOCKEN_SECRATE,{
        expiresIn: process.env.REQUIRED_TOCKEN_EXPIER
    }
)
}
export const User = mongoose.model("User", userSchema)