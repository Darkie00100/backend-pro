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
    await user.save({validateBeforeSave:false});
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

   const isPasswordValid = await user.passwordCheck(password);
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
   .cookie("accessTokens",accessTokens,options)
   .cookie("refreshTokens",refreshTokens,options)
   .json(
    new ApiResponse(200,{logedinUser,accessTokens,refreshTokens},
      "User login Sucessfull"
    )
   )
   })

const logout = asyncHandler(async (req,res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshTokens: 1
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

const changePassword = asyncHandler(async (req,res) => {
  const {oldPassword,newPassword} = req.body;
  const user = await User.findById(req.user?._id);

  const correctPassword = await user.isPasswordValid(oldPassword);
  if (!correctPassword) {
    throw new ApiError(400,"Invalid oldPassword");
  }

   user.password = newPassword;
  await user.save({validateBeforeSave:false})

  return res.status(200)
  .json(new ApiResponse(200,{},"Password changed successfully"))
})
const getUser = asyncHandler(async (req,res) => {
  return res.status(200)
  .json(new ApiResponse(200,req.user,"User fetched Succesfully"));
})
const updateUserDetailes = asyncHandler(async (req,res) => {
  const {fullName,email} = req.body;

  if (!(fullName||email)) {
    throw new ApiError(401,"field are required")
  }
 
  const updateFields = {}
  if(fullName){updateFields.fullName = fullName}
   if(email){
     const existEmail = await User.findOne({
     email,
     _id: { $ne: req.user?._id }
    });

   if (existEmail) {
    throw new ApiError(400,"Email already exit")
   }

    updateFields.email = email
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: updateFields
    },{new:true}
  ).select("-password")

  return res.status(200)
  .json(new ApiResponse(200,user,"User detiles updated"))
})
const updateAvatar = asyncHandler(async (req,res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400,"invalid avatar localpath")
  }

  const avatar = await uplodeOnCloudeinary(avatarLocalPath);
  if (!avatar.url) {
    throw new ApiError(500,"error while uploading avatar")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        avatar:avatar.url
      }
    },
    {new:true}
  ).select("-password")

  return res.status(200)
  .json(new ApiResponse(201,user,"User avatar updated successfully"))
})
const updateCoverImage = asyncHandler(async (req,res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(401,"invalid coverImage Localpath")
  }

  const coverImage = await uplodeOnCloudeinary(coverImageLocalPath)
  if (!coverImage) {
    throw new ApiError(500,"Error while uploading coverImage")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        coverImage:coverImage.url
      }
    },
    {new:true}
  ).select("-password")

  return res.status(200)
  .json(new ApiResponse(201,user,"User coverImage updated successfully"))
})
const getUserChannelProfile = asyncHandler(async (req,res) => {
  const {userName} = req.params;

  if(!userName?.trim()){
    throw new ApiError(400,"missing userName")
  }

  const channel = await User.aggregate([
    {
      $match:{
        userName:userName?.toLowerCase()
      }
    },
    {
      $lookup:{
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers"
      }
    },
    {
      $lookup:{
        from:"subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as:"subscribedTo"
      }
    },
    {
      $addFields:{
        subscribersCount:{
          $size: "subscribers"
        },
        channelCount:{
          $size:"subscribedTo"
        },
        isSubscribed:{
          $cond:{
            if:{$in:[req.user?._id,"$subscribers.subscriber"]},
            then: true,
            else: false
          }
        }
      }
    },
    {
      $project:{
        fullName: 1,
        userName: 1,
        email: 1,
        avatar:1,
        coverImage:1,
        subscribersCount:1,
        channelCount:1,
        isSubscribed:1
      }
    }
  ])

  if (!channel?.length) {
    throw new ApiError(404,"channel doesnot exist")
  }

  return res.status(200)
  .json(new ApiResponse(200,channel[0],"user channel fetched successfully"))
})
export {
  registerUser,
  login,
  logout,
  changePassword,
  getUser,
  updateUserDetailes,
  updateAvatar,
  updateCoverImage,
  getUserChannelProfile
}