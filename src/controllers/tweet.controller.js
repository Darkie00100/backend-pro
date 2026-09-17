import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body;
    const tweet  = await Tweet.create({
        content: content,
        owner: req.user?._id
    })
    return res.status(200)
    .json(new ApiResponse(200,tweet,"tweet created successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    if(!isValidObjectId(req.user?._id)){
        throw new ApiError(400,"unauthorized user!...")
    }
    const tweets = await Tweet.find({owner:req.user?._id})
    if ( tweets.length == 0){
         return new ApiResponse(207,[],"empty tweets")
    }
    return res.status(200)
    .json(new ApiResponse(200,tweets,"successfully featched all tweets"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {newTweet} = req.body;

    if (!newTweet || !newTweet.trim()) {
        throw new ApiError(400,"empty comment OR commnet has only blank spaces")
    }

    if (!isValidObjectId(req.params.tweetId)) {
        throw new ApiError(400,"Invalid Tweet ID")
    }
    const tweet = await Tweet.findById(req.params?.tweetId)
    if (!tweet) {
        throw new ApiError(404,"Tweet not found")
    }
    if (tweet.owner!=req.user?._id) {
        throw new ApiError(403,"You cannot update Others Tweets!...")
    }
    // 401 = unauthorized ; 403 = authorized but u r not the owner
    /*401 Unauthorized → technically means not authenticated (no valid login/credentials).
403 Forbidden → the request is understood/authenticated, but the user doesn't have permission to perform the action*/
    const updatedTweet = await Tweet.findByIdAndUpdate(
        req.params.tweetId,
        {$set:{
            content: newTweet
        }},
        {new: true}
    )
    return res.status(200)
    .json(new ApiResponse(200,updatedTweet,"tweet updtaed successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const tweet = await Tweet.findById(req.params?.tweetId)
        if (tweet.owner!=req.user?._id) {
        throw new ApiError(403,"You cannot delete Others Tweets!...")
    }
    if (!isValidObjectId(req.params.tweetId)) {
        throw new ApiError(400,"Invalid Tweet ID")
    }
    const deletedTweet = await Tweet.findByIdAndDelete(req.params.tweetId)
    
    return res.status(200)
    .json(new ApiResponse(200,deletedTweet,"tweet delated successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}