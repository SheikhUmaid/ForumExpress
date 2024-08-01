import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js"
import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"
const verifyJwt = asyncHandler(async (req,_,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        console.log(token);
        if(!token){
            throw new ApiError(401, "failed to authenticate")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESSTOKEN);
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401, "Incorrect Access Token")
        }
    
        req.user = user;
        next(); 
    } catch (error) {
        console.log(error);
        throw new ApiError(401,"invalid access token",error)
    }


})


export default verifyJwt