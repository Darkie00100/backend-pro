import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {getAllVideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus} from "../controllers/video.controller.js"
import { upload} from "../middlewares/multer.midleware.js";

    const router = Router()

    router.route("/publish-video").post(verifyJWT,
        upload.fields([
            {
                name: "videoFile",
                maxCount:1
            },
            {
                name: "thumbnail",
                maxCount: 1
            }
        ]),publishVideo)

    router.route("/get-video-by-id/:videoId").get(verifyJWT,getVideoById)
    router.route("/get-all-videos").get(getAllVideos)
    router.route("/update-video/:videoId").patch(verifyJWT,upload.single("thumbnail"),updateVideo)
    router.route("/delete-video/:videoId").delete(verifyJWT,deleteVideo)
    router.route("/toggle-publish-status/:videoId").patch(verifyJWT,togglePublishStatus)

export default router