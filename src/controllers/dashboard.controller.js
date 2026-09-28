import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    /* TODO: Get the channel stats like total video views,
     total subscribers, 
     total videos, 
     total likes etc*/
    const videostats = await Video.aggregate([
        {
            $match:{
                owner:req.user?._id
            }
        },
        {
            $group:{
                _id:null,
                totalViews:{
                    $sum:"$views"
                },
                totalVideo:{
                    $sum:1
                }
                
            }
        }
    ])

    const subscriptionStasts = await Subscription.aggregate([
        {
            $match:{
                channel:req.user?._id
            }
        },
        {
            $count:"totalSubscribers"
        }
    ])

    const likeStats = await Like.aggregate([
        {
            $lookup:{
                from:"videos",
                localField:"video",
                foreignField:"_id",
                as:"videodet"
            }
        },
        {
            $unwind:"videodet"
        },
        {
            $match:{
                "videodet.owner": req.user?._id
            }
        },
        {
            $count:"TotalLikes"
        }
    ])

    return res.status(200)
    .json(new ApiResponse(200,{videostats,likeStats,subscriptionStasts},"channel stats fetched successfully"))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const videos = await Video.find({
        owner: req.user?._id
    }).sort({ createdAt: -1 })

    return res.status(200)
    .json(new ApiResponse(200,videos,"videos fetched successfully"))
})

export {
    getChannelStats, 
    getChannelVideos
    }