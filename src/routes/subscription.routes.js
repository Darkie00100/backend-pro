import { Router } from "express";
import {toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels} from "../controllers/subscription.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/subscription/toggle/:channelId").post(verifyJWT,toggleSubscription)
router.route("/subscription/channel-Subscribers/:channelId").get(verifyJWT,getUserChannelSubscribers)
router.route("/subscription/subscribered-channel/:subscriberId").get(verifyJWT,getSubscribedChannels)

export default router