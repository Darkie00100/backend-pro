import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
    const newPlaylist = await Playlist.create(
        {
            name: name,
            description: description,
            owner: req.user?._id,
            video: []

        }
    )
    /*await newPlaylist.save()
use .save when u like to update and created something using new keyword
    const something = new dbname() here we have to use .save
.create() creates and saves the data in the mongoose*/
    return res.status(201)
    .json(new ApiResponse(201,newPlaylist,"new PlayList created successfully"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlistsxis
    if (!isValidObjectId(userId)) {
        throw new ApiError(401,"invalid userid")
    }

    const userPlaylist = await Playlist.find({owner:userId}).populate("video")

    return res.status(200)
    .json(new ApiResponse(200,userPlaylist,"user PlayList fetched successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"invalid playlist id")
    }

    const playlistbyId = await Playlist.findById(playlistId).populate("video")
    if (!playlistbyId) {
        throw new ApiError(404,"playlist not found")
    }
    return res.status(200)
    .json(new ApiResponse(200,playlistbyId,"playlist by is is fetched successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400,"invalid Playlist ID")
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400,"invalid vider ID")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404,"playlist doesnot exist")
    }

    const existVideo =  playlist.video.some((existingVideo)=>{
        return existingVideo.toString() === videoId
    })

    if (existVideo) {
        throw new ApiError(400,"video already exist")
    }

    playlist.video.push(videoId)
    await playlist.save()
   
     
    return res.status(201)
    .json(new ApiResponse(201,playlist,"video added successfully"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400,"invalid Playlist ID")
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400,"invalid vider ID")
    }
    /*const playlist = await Playlist.findById(playlistId)
    const index = playlist.video.findIndex((video)=>{
        return video.toString() === videoId
    })
        if(index<0){
        throw new ApiError(404,"video not found")
        }
    playlist.video.splice(index,1)
    await playlist.save()*/

    const playlist = await Playlist.findById(playlistId)
    
    if (!playlist) {
        throw new ApiError(404,"playlist doesnot exist")
    }
    const existVideo = playlist.video.some((existingVideo)=>{
        return existingVideo.toString() === videoId
    })

    if (!existVideo) {
        throw new ApiError(404,"video not found" )
    }
     const newplaylist = await Playlist.findByIdAndUpdate(
        playlistId,{
            $pull:{
                video:videoId
            }
        },
        { new: true }
    )
    return res.status(200)
    .json(new ApiResponse(200,newplaylist,"video removed successfully"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400,"invalid playlist Id")
    }
    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404,"playlist not found")
    }

    if(playlist.owner.toString() !=req.user?._id.toString()){
        throw new ApiError(403,"invalid user Login")
    }

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId)

    return res.status(200)
    .json(new ApiResponse(200,deletedPlaylist,"playlist deleted successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400,"invalid playlist Id")
    }

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404,"playlist not found")
    }

    if(playlist.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(403,"invalid user login")
    }

    const updateData = {}
    if (name !== undefined) {
        updateData.name = name.trim()
    }
    if (description !== undefined) {
        updateData.description = description.trim()
    }
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        updateData,
        {new:true}
    )

    return res.status(200)
    .json(new ApiResponse(200,updatedPlaylist,"Playlist updated successfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}