import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js"
import { User } from "../models/user.model.js";
import cookieOptions from "../utils/cookieOptions.js";
import jwt from "jsonwebtoken"



const registerUser = asyncHandler(async (req,res)=>{
    const {username, email,password, name} = req.body
    if ([username, email, password, name].some((field) => field.trim()==="")){
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{username, email}]
    });

    if(existedUser){
        throw new ApiError(409, "User already exists");
    }

    //creating a user


    const createdUser = await User.create({
        name: name,
        username: username,
        password: password,
        email:email,
    })

    if(!createdUser){
        throw new ApiError(500, "Some Error Occured while registering, Please try again later");
    }
    const user = await User.findById(createdUser._id).select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(200, user, "User has been created successfully")
    )
})


const generateAccessAndRefreshTokens = async(userId)=>{
    try{
        const user = await User.findById(userId)
        const accesstoken = await user.generateAccessToken()

        const refreshToken = await user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})
        return {accesstoken, refreshToken}
    }catch (error){
        throw new ApiError(500, "something went wrong while generating tokens")
    }
}

const loginUser = asyncHandler(async (req, res)=>{
    const {email, password, username} = req.body;
    if(!email && !username){
        throw new ApiError(500, "enter username or email")
    }
    const user = await User.findOne({
        $or:[{username},{email}]
    });

    if(!user){
        throw new ApiError(404,"User does not exits")
    }

    if(!user.isPasswordCorrect(password)){
        throw new ApiError(405, "USer credentials are incorrect");
    }

    const {accesstoken, refreshToken} = await generateAccessAndRefreshTokens(user._id)


    const loggedInUser = await User.findById(user._id)

    req.loggedInUser = loggedInUser 
    return res.
    status(200).
    cookie("accessToken", accesstoken, cookieOptions).
    cookie("refreshToken", refreshToken, cookieOptions).
    json(
        new ApiResponse(
            200,{
                user: loggedInUser,
                accesstoken, 
                refreshToken
            },
            "User logged in successfully"
        )
    )
})




const logoutUser = asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,{
            $set:{
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    return res.
    status(200).
    clearCookie("accessToken", cookieOptions).
    clearCookie("refreshToken", cookieOptions).
    json(new ApiResponse(200, {}, "Logged out succcessfully"))
})





const refreshAccessToken = asyncHandler(async (req,res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401, "unauthorize  d request")
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESHTOKEN)
        const user = await User.findById(decodedToken._id)
        if(!user){
            throw new ApiError(401, "Invalid refresh token")
        }
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "refresh token expired or used")
        }
    
        const {accesstoken, refreshtoken} = await generateAccessAndRefreshTokens(user._id)
    
        res.status(200).
        cookie("accessToken",accesstoken, cookieOptions).
        cookie("refreshToken",refreshtoken, cookieOptions).
        json(
            new ApiResponse(
                200,
                {accesstoken, refreshtoken},
                "new access token generated"
            )
        )
    } catch (error) {
        throw  new ApiError(401, "Invalid refresh token ")
    }


})




const verifyUser = asyncHandler(async (req,res) =>{
    const {userId, verificationString} = req.params
    if(!userId && ! verificationString) throw new ApiError(400, "Invalid parameters");
    let user = await User.findById(userId).select("-password -refreshToken")
    if(!user) throw new ApiError(404, "User Not Found");
    if(user.isVerified){
        return res.status(201).json(
            new ApiResponse(21,{}," user is already verified")
        )
    }
    if (user.verificationString != verificationString) throw new ApiError(400, "Could not verify this user");
    user = await User.updateOne({_id: userId},{
        $set:{
            isVerified:true,
        }
    })
    return res.status(200).json(
        new ApiResponse(200, user, "The User has been verified successfully")
    )

})

export {registerUser, loginUser, logoutUser, refreshAccessToken, verifyUser}