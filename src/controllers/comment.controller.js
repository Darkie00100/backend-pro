import mongoose,{isValidObjectId}  from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from "../models/video.model.js"
const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    const skip = (page-1)*limit
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400,"invalid video Id")
    }

    const existvideo = await Video.findById(videoId)
    if (!existvideo) {
        throw new ApiError(404,"video doesnot exist or not found")
    }
     const comment = await Comment.find(
        {video:videoId}
     ).skip(skip)
     .limit(limit)
     .sort({createdAt:-1})

     return res.status(200)
     .json(new ApiResponse(200,comment,"video comment fetched successfully"))
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {content} = req.body
    const {videoId} = req.params
    
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400,"invalid video Id")
    }

    const existVideo  = await Video.findById(videoId)
    if (!existVideo) {
        throw new ApiError(404,"commented video is not found or doesnot exist!...")
    }

    if(content === undefined || content == null){
        throw new ApiError(400,"comment can't be null")
    }
    if (!content.trim()) {
            throw new ApiError(400,"comment content cannot be null or blank")
        }
        
    const comment = await Comment.create({
        content: content,
        video: videoId,
        owner: req.user?._id
    })

    return res.status(201)
    .json(new ApiResponse(201,comment,"comment created successfully"))
}) 

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    const {Content} = req.body
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400,"invalid comment Id")
    }
        if(content === undefined || content == null){
        throw new ApiError(400,"comment can't be null")
    }
    if (!content.trim()) {
            throw new ApiError(400,"comment content cannot be null or blank")
        }
    
    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(404,"comment not found")
    }

    if (comment.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403,"invalid user")
    }
    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            content:commentContent
        },
        {
            new:true
        }
    )

    return res.status(200)
    .json(new ApiResponse(200,updatedComment,"comment updated successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400,"invalid comment Id")
    }

    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(404,"comment doesnot exist or not found")
    }
    if (comment.owner.toString()!== req.user?._id.toString()) {
        throw new ApiError(403,"invalid user ")
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId)

    return res.status(200)
    .json(new ApiResponse(200,deletedComment,"successfully deleted comment"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }