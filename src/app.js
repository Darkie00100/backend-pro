import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser()); // 👈 I MISSING THIS so the cookie were saying undefined while logout and causing unauthorized request

//import Router
import userRouter from "./routes/user.routes.js"
import serverRouter from "./routes/healthcheck.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import likeRouter from "./routes/like.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboradRouter from "./routes/dashboard.routes.js"
// Router declaration
app.use("/user",userRouter);
// http://localhost:3000/user/register

app.use("/server-health",serverRouter)
// http://localhost:3000/server-health/health-check

app.use("/tweets",tweetRouter);
//http://localhost:3000/tweets/createTweet 
/*(use the tweets methods in its controller)  
createTweet, getUserTweets, updateTweet, deleteTweet */

app.use("/likes",likeRouter)
//http://localhost:3000/likes/createTweet 
/*toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos*/

app.use("/subscription",subscriptionRouter)
//http://localhost:3000/subscription/createTweet 
/*toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels*/
app.use("/playlist",playlistRouter)
//http://localhost:3000/playlist/createTweet
/*createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist*/
app.use("/dashboard",dashboradRouter)
//http://localhost:3000/dashboard/createTweet
/*getChannelStats, getChannelVideos*/
export {app};