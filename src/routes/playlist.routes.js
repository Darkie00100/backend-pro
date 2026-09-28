import { Router } from "express";
import {createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist} from "../controllers/playlist.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";    const router = Router()

    router.route("/playlist/create-playlist").post(verifyJWT,createPlaylist)
    router.route("/playlist/get-playlist/:userId").post(verifyJWT,getUserPlaylists)
    router.route("/playlist/get-playlist-by-Id/:playlistId").post(verifyJWT,getPlaylistById)
    router.route("/playlist/:playlistId/add-video/:videoId").post(verifyJWT,addVideoToPlaylist)
    router.route("/playlist/:playlistId/remove-video/:videoId").post(verifyJWT,removeVideoFromPlaylist)
    router.route("/playlist/update-playlist/:playlistId").post(verifyJWT,updatePlaylist)
    router.route("/playlist/delete-playlist/:playlistId").post(verifyJWT,deletePlaylist)

export default router