import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {uplodeOnCloudeinary} from "../utils/cloudeinary.js";
import {User} from "../models/user.model.js";

const registerUser = asyncHandler(async (req,res)=>{
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

   const avatarLocalPath = req.files?.avatar[0].path;
   const coverImageLoaclpath = req.files?.coverImage?.[0].path;

   if (!avatarLocalPath) {
    throw new ApiError(400,"Avatar is required");
   }

  const avatar = await uplodeOnCloudeinary(avatarLocalPath);
  const coverImage = coverImageLoaclpath?await uplodeOnCloudeinary(coverImageLoaclpath):null;

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

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered succesfully")
  )


})
export {registerUser}