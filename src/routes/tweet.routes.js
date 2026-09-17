import { Router } from "express";
import {createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet} from "../controllers/tweet.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-Tweet").post(verifyJWT,createTweet);
router.route("/get-Tweets").get(verifyJWT,getUserTweets);
router.route("/c/:tweetId").patch(verifyJWT,updateTweet);
router.route("/c/:tweetId").delete(verifyJWT,deleteTweet)

export default router;