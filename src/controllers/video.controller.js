import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uplodeOnCloudeinary} from "../utils/cloudeinary.js";


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy="createdAt", sortType=-1, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    const pageNumber = Number(page)
    const limitNumber = Number(limit)

    const skip = (pageNumber - 1) * limitNumber

    const filter = {
        isPublished: true
    }

    // Search by title or description
    if (query?.trim()) {
        filter.$or = [
            { title: { $regex: query.trim(), $options: "i" } },
            { description: { $regex: query.trim(), $options: "i" } }
        ]
    }

    // Filter videos by a particular user
    if (userId) {
        if (!isValidObjectId(userId)) {
            throw new ApiError(400, "invalid user Id")
        }

        filter.owner = userId
    }

    const sort = {
        [sortBy]: Number(sortType)
    }

    const videos = await Video.find(filter)
        .populate("owner", "username avatar")
        .sort(sort)
        .skip(skip)
        .limit(limitNumber)

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                videos,
                "videos fetched successfully"
            )
        )
})


const publishVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    const videoLocalPath = req.files?.videoFile?.[0].path; 
    /* use the name while what you will give in router like videoFile
    router.route("/publish-video").post(verifyJWT,
        upload.fields([
            {
                name: "videoFile",
                maxCount:1
            },
            {
                name: "thumbnail",
                maxCount: 1
            }
        ]),publishVideo)
    */
    const thumbnailLocalPath = req.files?.thumbnail?.[0].path;

    if (!title?.trim()) {
        throw new ApiError(400,"title cant be blank")
    }
    if (!description?.trim()) {
        throw new ApiError(400,"description cannot be null")
    }
    if (!videoLocalPath) {
        throw new ApiError(400,"videro is required")
    }

    if ((!thumbnailLocalPath)) {
        throw new ApiError(400,"thumbnail is required")
    }
     const videoFile = await uplodeOnCloudeinary(videoLocalPath)
     const thumbnail = await uplodeOnCloudeinary(thumbnailLocalPath)

     if (!videoFile) {
        throw new ApiError(500,"something went wrong while video upload")
     }

     if (!thumbnail) {
        throw new ApiError(500,"something went wrong while thumbnail upload")
     }
     const video = await Video.create(
        {
            videoFile: videoFile.url,
            thumbnail: thumbnail.url,
            owner: req.user?._id,
            title:title.trim(),
            description: description,
            duration:videoFile.duration
        }
     )

     if (!video) {
        throw new ApiError(500,"something went wrong while publishing video!...")
     }

     return res.status(201)
     .json(new ApiResponse(201,video,"video published successfully"))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if (!isValidObjectId(videoId)) {
        throw new ApiError(401,"invalid video Id")
    }
    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404,"video not found")
    }

    return res.status(200)
    .json(new ApiResponse(200,video,"video fetched successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400,"invalid video id")
    }
    const {title,description} = req.body
    if (!title?.trim()) {
        throw new ApiError(400,"title cannot be null or blank space")
    }
    if (!description?.trim()) {
        throw new ApiError(400,"description cannot be null or blank space")
    }
    const thumbnailLocalPath = req.file?.path
    if (!thumbnailLocalPath) {
        throw new ApiError(400,"thumbnail required")
    }

    const thumbnail = await uplodeOnCloudeinary(thumbnailLocalPath)
    if (!thumbnail) {
        throw new ApiError(500,"error came while uploading thumbnail")
    }
    const existVideo  = await Video.findById(videoId)
    if (!existVideo) {
        throw new ApiError(404,"video not found")
    }

    if (existVideo.owner.toString()!== req.user?._id.toString()) {
        throw new ApiError(403,"unauthorized user")
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            title:title.trim(),
            description:description.trim(),
            thumbnail:thumbnail.url
        },
        {new:true}
    )

    return res.status(200)
    .json(new ApiResponse(200,updatedVideo,"video updated successfully"))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if (!isValidObjectId(videoId)) {
        throw new ApiError(401,"invalid video Id")
    }
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404,"video not found")
    }
    if (video.owner.toString()!==req.user?._id.toString()) {
        throw new ApiError(403,"unauthorized user")
    }
    await Video.findByIdAndDelete(videoId)
/*   to delete it from cloudinary
    const extractPublicId = (url) => {
    const parts = url.split("/upload/")[1]
    const withoutVersion = parts.replace(/^v\d+\//, "")
    return withoutVersion.substring(0, withoutVersion.lastIndexOf("."))
    }

    const publicId = extractPublicId(video.videoFile)
    console.log(publicId)

    *** for video ***
    const videoPublicId = extractPublicId(video.videoFile)
    await cloudinary.uploader.destroy(videoPublicId, {
    resource_type: "video"
    })

    *** for image ***
    const thumbnailPublicId = extractPublicId(video.thumbnail)
    await cloudinary.uploader.destroy(thumbnailPublicId, {
    resource_type: "image"
    })
    */

    return res.status(200)
    .json(new ApiResponse(200,"video deleted successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
     
    if (!isValidObjectId(videoId)) {
        throw new ApiError(401,"invalid video Id")
    }
    
     const video = await Video.findById(videoId)
     if (!video) {
        throw new ApiError(404,"video not found or not exist")
     }

     if (video.owner.toString()!=req.user?._id.toString()) {
        throw new ApiError(403,"unauthorized user")
    }
     const toggleVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            isPublished:!video.isPublished
        },
        {new:true}
     )
    
     return res.status(200)
     .json(new ApiResponse(200,toggleVideo,"video toggle successfully"))
})

export {
    getAllVideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}