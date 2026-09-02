import { ApiError} from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const verifyJWT = asyncHandler(async (req,res,next) => {
    const token = req.cookies?.accessTokens||req.header
    ("Authorization")?.replace("Bearer ","")

    if (!tokens) {
        throw new ApiError(404,"Unauthorized Request")
    }
    const decodedToken = await jwt.verify(token,process.env.ACCESS_TOCKEN_SECRATE)
    
    const user = await User.findById(decodedToken._id)
    .select("-password -refreshTokens")

    if (!user) {
        throw new ApiError(401,"Invalid acsess token")
    }

    req.user = user
    next()
})

export{
    verifyJWT
}