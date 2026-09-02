import { Router } from "express";
import { registerUser,login,logout } from "../controllers/user.controllers.js";
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
export default router;