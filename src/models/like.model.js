import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
        video:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        },
        likedBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        comment:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        },
        tweet:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tweet"
        }
},{timestamps:true})

likeSchema.index(
    {likedBy:1,video:1},
    {unique: true}
)

likeSchema.index(
    { likedBy: 1, comment: 1 },
    { unique: true }
)

likeSchema.index(
    { likedBy: 1, tweet: 1 },
    { unique: true }
)

export const Like = mongoose.model("Like",likeSchema)