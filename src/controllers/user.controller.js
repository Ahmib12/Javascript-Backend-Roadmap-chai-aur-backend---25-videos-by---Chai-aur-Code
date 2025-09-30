// import asyncHandler from "../utils/asyncHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js"; 
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // return res.status(200).json({
  //   message: "syeda's world it is-- be careful -- > ok",
  // });

  // get user details from FE
  // validation - not empty
  // check if user already exists : username, email
  // check for images,check for avatar
  // upload them to cloudinary
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return response - res

  // ***** get user details from FE
        //  const {username,email.fullName,avatar,coverImage,watchHistory,password,refreshToken} = req.body
        const { username, email, fullName, password } = req.body;
        //  console.log(fullName,username,email,password);
        console.log("email: ", email);

  // ***** validation - not empty
          // if(!fullName === ""){
          //   throw new ApiErrors(400,"fllname is required");
          // }

          if(
            [fullName,email,username,password].some((field) => 
              field?.trim() === "")
          ){
            throw new ApiErrors(400,"All fields are required");
          }

  // ***** check if user already exists : username, email
        //  const existedUser = await User.find({
         const existedUser = await User.findOne({
            $or: [{ username }, { email }]
          })

          if(existedUser){
            throw new ApiErrors(409,"User already exists with this useranme or email")
          }

   // ***** check for images,check for avatar
            const avatarLocalPath = req.files?.avatar[0]?.path; // -> similarly do for the coverImage
            const coverImageLocalPath = req.files?.coverImage[0]?.path;
            if(!avatarLocalPath){
              throw new ApiErrors(400,"Avatar field is required");
            }

    // ***** upload them to cloudinary
          const avatar = await uploadToCloudinary(avatarLocalPath);
          const coverImage = await uploadToCloudinary(coverImageLocalPath);
          
          // again check if avatar was uploaded or not - as its the required field
          if(!avatar){
            throw new ApiErrors(400, "Avatar field is required.,.,.,");
          }

    // ****create user object - create entry in db
          const user = await User.create({
            fullName,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            email,
            password,
            username: username.toLowerCase(),
          })
          
    // ***** remove password and refresh token field from response
            const createdUser = await User.findById(user._id).select(
              "-password -refreshToken"
     )

   // *** check for user creation
   if(!createdUser){
    throw new ApiErrors(500,"something went wrong - while Registering the User")
   }

  // return response - res
   return res.status(201).json(
    new ApiResponse(200,createdUser,"User Registered Successfully")
   )

});

export { registerUser };
