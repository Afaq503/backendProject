import { v2 as cloudinary } from "cloudinary";

import fs from 'fs'

          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET, 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        // Upload file on Cloudinary
       const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: 'auto'
        })
        // file hase been uploaded successfully
        console.log("File is uploaded on cloudinary",response.url);
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove temporary file as ths upload operation got failed
        return null;
    }
}

export { uploadOnCloudinary }
