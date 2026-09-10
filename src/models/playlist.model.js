import mongoose from "mongoose";

const playlistSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    discription:{
        type: String,
        required:true
    },
    video:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        },
    owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
})

export const Playlist = mongoose.model("Playlist",playlistSchema)