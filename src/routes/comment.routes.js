import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {getVideoComments, 
    addComment, 
    updateComment,
     deleteComment} from "../controllers/comment.controller.js"


const router = Router()

    router.route("/comments/get-comments/:videoId").get(verifyJWT,getVideoComments)
    router.route("/comments/add-comments/:videoId").post(verifyJWT,addComment)
    router.route("/comment/update-comment/:commentId").patch(verifyJWT,updateComment)
    router.route("/comment/delete-comment/:commentId").delete(verifyJWT,deleteComment)

export  default router