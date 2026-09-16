import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {User} from "../models/user.model.js"

const healthcheck = asyncHandler(async (req, res) => {
    //TODO: build a healthcheck response that simply returns the OK status as json with a message

    const user = await User.findById(req.user?._id).select("email userName fullName")
    return res.status(200)
    .json(new ApiResponse(200,user,"server is running healthlly"))
})

export {
    healthcheck
    }
    