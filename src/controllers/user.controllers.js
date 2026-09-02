import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {uplodeOnCloudeinary} from "../utils/cloudeinary.js";
import {User} from "../models/user.model.js";
import { set } from "mongoose";

const generateAccessRefreshTocken = async (userid) => {
  try {
    const user = await User.findById(userid);
    const accessTokens = await user.generateAccessToken();
    const refreshTokens = await user.generateRequiredToken();
    user.refreshTokens = refreshTokens;
    await user.save({validationBeforeSave:false});
    return {accessTokens,refreshTokens}
  } 
  
  catch (error) {
    throw new ApiError(500,error?.message||"Something went wrong while generating tokens!!!...");
  }
}

const registerUser = asyncHandler(async (req,res)=>{
//   console.log("FILES:", req.files);
// console.log("BODY:", req.body);
console.log("CONTENT TYPE:", req.headers["content-type"]);
    console.log("FILES:", req.files);
    console.log("BODY:", req.body);

   const {fullName,email,userName,password} =req.body
   console.log("email: ",email);

   if ([fullName,email,userName,password].some(
    (field)=>field?.trim() === "")
    )
    {
    throw new ApiError(400,"All fielsd are Required");
   }

  const existedUser= await User.findOne({
    $or: [{userName},{email}]
   })

   if (existedUser) {
    throw new ApiError(409,"User with give email or username already exist try other username or email!!!... ")
   } 

   const avatarLocalPath = req.files?.avatar?.[0]?.path;
   console.log("AVATAR PATH:", avatarLocalPath);
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

   if (!avatarLocalPath) {
    throw new ApiError(400,"Avatar is required");
   }

  const avatar = await uplodeOnCloudeinary(avatarLocalPath);const coverImage = coverImageLocalPath
    ? await uplodeOnCloudeinary(coverImageLocalPath)
    : null;
  
  if (!avatar) {
    throw new ApiError(400,"Avatar is required");
  }

  const user = await User.create({
    fullName,
    email,
    password,
    userName: userName.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage?.url||""
  })

   const createdUser = await User.findById(user._id).select(
    "-password -refreshTokens"
  );

   if (!createdUser) {
    throw new ApiError(500, "Something went wrong while User registration");
  }
 console.log("FILES:", req.files);
console.log("BODY:", req.body);
  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered succesfully")
  )
})
const login = asyncHandler(async (req,res)=>{
    const{userName,email,password} = req.body;

    if(!(userName || email)){
      throw new ApiError(401," Username or email is required");
    }

   const user = await User.findOne({
      $or: [{userName},{email}]
    })

   const isPasswordValid = await User.passwordCheck(password);
   if (!isPasswordValid) {
    throw new ApiError(404,"incorrect password");
   }

   const {accessTokens,refreshTokens} = await generateAccessRefreshTocken(user._id);

   const logedinUser = await User.findById(user._id).select("-password -refreshTokens");

   const options= {
    httpOnly:true,
    secure: true
   }

   return res.status(200)
   .cookie("accesstokens",accessTokens,options)
   .cookie("refreshTokens",refreshTokens,options)
   .json(
    new ApiResponse(200,{logedinUser,accessTokens,refreshTokens},
      "User login Sucessfull"
    )
   )
   })

const logout = asyncHandler(async (req,res) => {
  await User.findById(
    req.user._id,
    {
      $set: {
        refreshTokens: undefined
      }
    },  
        {
        new: true
      }

  )

  const options= {
    httpOnly: true,
    secure: true
  }

  return res.status(200)
  .clearCookie("accessTokens",options)
  .clearCookie("refreshTokens",options)
  .json(
    new ApiResponse(200,{},"User loged out Successfully")
  )
})
export {
  registerUser,
  login,
  logout
}