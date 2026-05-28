import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser= asyncHandler(async (req,res)=>{
    // get user details from frontend
    // validation - shouldn't be empty
    // check if user already exists could be done from email and username
    // check for images and check for avatar
    // upload them to couldinary , avatar is important
    // create user object and create entry in db
    // remove password and refresh token form response
    // check for user creation 
    // return a response 


    const { fullName,email,username,password } = req.body
    console.log("email:",email) 

    if(
    [fullName,email,password,username].some((field)=>field?.trim()==="")
    ){
        throw new ApiError(400,"All feilds are required")
    }
    const exitedUser = await User.findOne({
        $or: [{username},{email}]
    })

    if(exitedUser){
        throw new ApiError(409,"User with email or username already exist")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required ");
    }

        const avatar=await uploadOnCloudinary(avatarLocalPath)
        const coverImage=await uploadOnCloudinary(coverImageLocalPath)
        
          console.log(req.files)
        if(!avatar){
        throw new ApiError(400,"Avatar file is required");

        }

        const user= await User.create({
            fullName,
            avatar: avatar.url,
            coverImage:coverImage?.url || "",
            email,
            password,
            username:username.toLowerCase()
        })

        const createdUser = await User.findById(user._id).select("-password -refreshToken")
        if(!createdUser){
            throw new ApiError(500,"something went wrong while registring user")
        }
      

        return res.status(201).json(
            new ApiResponse(200,createdUser,"User registered successfully")
        )
})


export {registerUser};