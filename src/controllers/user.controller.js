// import asyncHandler from "../utils/asyncHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async(userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // to save the refresh token in db
    user.refreshToken = refreshToken;
    // to save the user with refresh token
    await user.save({ validateBeforeSave: false }); // as we are not sending all the required fields - so to avoid validation error

    return {accessToken, refreshToken};

  } catch (error) {
    throw new ApiErrors(500,"something went wrong while generating access and refresh tokens || Internal server error")
  }
}

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
  // console.log("email: ", email);

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

  // console.log(req.files);
          

  // ***** check for images,check for avatar
  const avatarLocalPath = req.files?.avatar[0]?.path; // -> similarly do for the coverImage
  // const avatarLocalPath =
  //   req.files &&
  //   Array.isArray(req.files.avatar) &&
  //   req.files.avatar.length > 0
  //     ? req.files.avatar[0].path
  //     : null;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
            if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    coverImageLocalPath = req.files.coverImage[0]?.path;
  }



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

const loginUser = asyncHandler(async (req,res) => {
  // get data from req body
  // username or email (one of them is required, we ca use both -- will see this here)
  // find the user
  // password check
  // access and refresh tokem generate
  // send cookie

  // ** get data from req body
  const { username, email, password } = req.body;

  //** username or email (one of them is required, we ca use both -- will see this here)
  if (!username && !email) {
    // if (!(username || email)) {
    //  if(!username && !email){
    // if(!username){
    // if(!email )
    throw new ApiErrors(400, "username or email is required");
  }

  //**  find the user
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if(!user){
    throw new ApiErrors(404,'User does not exist || User not found || Invalid Credentials || Invalid username or email')
  }

  // ** password check
  const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
    throw new ApiErrors(401,'Invalid user Credentials || Invalid password')
  }

  // ** access and refresh tokem generate
  const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

  // we need to update the user
    const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken ");

  // ** send cookie
  const options = {
    httpOnly: true,
    secure: true,
  }

  return res
    .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
    .json(
      new ApiResponse(
        200,
        {
        user: loggedInUser, accessToken, refreshToken
        },
        "User logged in successfully "
      )
  )

})

const logoutUser = asyncHandler(async (req,res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  // ** send cookie
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res.
  status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(
    new ApiResponse(200, {}, "user logged out successfully")
  )
})

// (hitting the endpoint) -> refresh access token controller - to generate new access token using refresh token (if access token is expired) - we will use the refresh token stored in the cookie
const refreshAccessToken = asyncHandler(async(req,res) => {
  // in below line we are getting the refresh token from cookie or from body (if not present in cookie -- mostly coz user is logged in from mobile app -- so we will send the refresh token in body)
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if(!incomingRefreshToken){
    throw new ApiErrors(401,"unauthorized request");
  }

try {
    const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
  
    const user = await User.findById(decodedToken._id)
  
    if(!user){
      throw new ApiErrors(401,"Invalid refresh token")
    }
  
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiErrors(401, "Refresh token is expired or used");
    }
  
    const options = {
      httpOnly: true,
      secure: true,
    }
  
    const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
  
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",newRefreshToken,options)
    .json(
      new ApiResponse(
        200,
        {accessToken, refreshToken: newRefreshToken},
        "Access token refreshed successfully|| Access token is generated successfully with refresh token"
      )
    )
} catch (error) {
  throw new ApiErrors(401,error?.message || "Invalid refresh token")
}

})

export { registerUser, loginUser, logoutUser , refreshAccessToken};
