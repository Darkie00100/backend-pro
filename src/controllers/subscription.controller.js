import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    if (!isValidObjectId(channelId)) {
        throw new ApiError(404,"invalid channel Id")
    }
    const channelExist = await User.findById(channelId)

    if (!channelExist) {
        throw new ApiError(401,"channel or user doesnot exist")
    }

    const existSubscription = await Subscription.findOne({
        channel: channelId,
        subscriber: req.user?._id
    })
    if (!existSubscription) {
        const addSubscription = await Subscription.create({
        channel: channelId,
        subscriber: req.user?._id  
        })

        return res.status(200)
        .json(new ApiResponse(200,addSubscription,"user subscribed successfully"))
    }

    const deleteSubscription = await Subscription.findByIdAndDelete(existSubscription?._id)

    return res.status(200)
    .json(new ApiResponse(200,deleteSubscription,"user unsubscribed successfully"))
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400,"Invalid channel id")
    }
    const existchannel = await User.findById(channelId)
    if (!existchannel) {
        throw new ApiError(404,"channel doesnot exist")
    }

    const subscribers = await Subscription.find({
        channel: channelId
    }).populate("subscriber")
    return res.status(200)
    .json(new ApiResponse(200,subscribers,"subscribers fetched successfully"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400,"invalid subscriber ID")
    }

    const existSubscriber = await User.findById(subscriberId)

    if (!existSubscriber) {
        throw new ApiError(404,"Subscriber doesnot exist")
    }

    const SubscribedChannels = await Subscription.find({
        subscriber: subscriberId
    }).populate("channel")

    return res.status(200)
    .json(new ApiResponse(200,SubscribedChannels,"SubscribedChannels List fetched successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}