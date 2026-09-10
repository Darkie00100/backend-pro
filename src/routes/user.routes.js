import { Router } from "express";
import { registerUser,login,logout,refreshAcesstokens,
  changePassword,
  getUser,
  updateUserDetailes,
  updateAvatar,
  updateCoverImage,
  getUserChannelProfile,
  getWatchHistory } from "../controllers/user.controllers.js";
import { upload} from "../middlewares/multer.midleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
registerUser)

router.route("/login").post(login)

//secure routes
router.route("/logout").post(verifyJWT,logout)
router.route("/refreshToken").post(refreshAcesstokens)
router.route("/change-Password").post(verifyJWT,changePassword)
router.route("/current-user").post(verifyJWT,getUser)
router.route("/update-user").post(verifyJWT,updateUserDetailes)
router.route("/update-avatar").patch(verifyJWT,upload.single("avatar"),updateAvatar)
router.route("/update couterImage").patch(verifyJWT,upload.single(coverImage),updateCoverImage)
router.route("/c/:username").get(verifyJWT,getUserChannelProfile)
router.route("/history").get(verifyJWT,getWatchHistory)

export default router;