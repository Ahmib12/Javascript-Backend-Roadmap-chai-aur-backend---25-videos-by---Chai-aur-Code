import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, // This is the API key from 'View API Keys' button
  api_secret: process.env.CLOUDINARY_API_SECRET, // This is the API secret from 'View API Keys' button
});

  // Upload an image
//   const uploadResult = await cloudinary.uploader
//   .upload(
//       'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//           public_id: 'shoes',
//       }
//   )
//   .catch((error) => {
//       console.log(error);
//   });

const uploadOnCLoudinary = async (localFIlePath) => {
    try {
        if(!localFIlePath) return null;
        // upload the file to cloudianry
       const response = await cloudinary.uploader.upload(localFIlePath, {
            resource_type: "autp",
        })
        // file has been uploaded successfully
        console.log("file is uploaded on cloudinary",response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localFIlePath); // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

export {uploadOnCLoudinary};
