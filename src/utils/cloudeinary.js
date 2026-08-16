import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINAR_CLOUD_NAME,
    api_key: process.env.CLOUDINAR_API_KEY,
    api_secret: process.env.CLOUDINAR_API_SECRATE
});

const uplodeOnCloudeinary = async (localfilePath)=>{
    try {
        if(!localfilePath){
            console.log("Couldnot find the path");
            return null;
        }
     const response = await cloudinary.uploader.upload(localfilePath,{
        resource_type: "auto"
     });
     console.log("File is upploadded succesfully on Coludinary!!! ",response.url);
     return response;
    } catch (error) {
        fs.unlinkSync(localfilePath);
        return null;
    }
}
export {uplodeOnCloudeinary}