import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSChema = new Schema(
    {
        username :{
            type: String,
            required : true,
            unique : true,
            lowercase : true,
            trim: true,
            index: true, // it helps in searching data in mongodb -- like in google search
          },
          email :{
            type: String,
            required : true,
            unique : true,
            lowercase : true,
            trim: true,
          },
          fullName :{
            type: String,
            required : true,
            trim: true,
            index: true,
          },
          avatar: {
            type: String, // clodnary url -> this converts image into link (url)
            required: true,
          },
          coverImage: {
            type: String, // clodnary url -> this converts image into link (url)
          },
          watchHistory: [
            {
             type: mongoose.Schema.Types.ObjectId,
             ref: "Video",   
            }
          ],
          password: {
            type: String,
            required: [true,"Password is required"], // for every field that is tru,u can give a custom message
          },
          refreshToken: {
            typeL: String,
          }
    },
    {
        timestamps: true  
    }
)

userSChema.pre("save",async function(next) {
   if(!this.isModified("password")) return next();
   this.password = bcrypt.hashSync(this.password,10);
   next();
})

userSChema.methods.isPasswordCorrect = async function (password) {
  await bcrypt.compare(password,this.password);
}

userSChema.methods.generateAccessToken = function() {
  jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  );
}
userSChema.methods.generateRefreshToken = function() {
  jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
}

export const User = mongoose.model("User",userSChema);
