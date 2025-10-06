import { User } from "../models/user.model";
import { ApiErrors } from "../utils/ApiErrors";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";


export const verifyJWT = asyncHandler(async(req, res, next) => {
  try {
      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer",""); 
  
      if(!token){
          throw new ApiErrors(401,"Unauthorized Request");
      }
  
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  
      const user = await User.findById(decodedToken._id).select("-password -refreshToken")
  
      if(!user){
          // NEXT_VIDEO: discuss about Frontend (later)
          throw new ApiErrors(401,"Invalid Acess token");
      }
  
      req.user = user;
      next();
  } catch (error) {
    throw new ApiErrors(401,"Invalid Access Token")
  }
})

//