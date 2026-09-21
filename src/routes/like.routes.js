import { Router } from "express";
import {toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos} from "../controllers/like.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/toggle/comment-like/:commentId").post(verifyJWT,toggleCommentLike)

router.route("/toggle/tweet-like/:tweetId").post(verifyJWT,toggleTweetLike)

router.route("/toggle/videos-like/:videoId").post(verifyJWT,toggleVideoLike)

router.route("/get-liked-video").get(verifyJWT,getLikedVideos)

export default router;