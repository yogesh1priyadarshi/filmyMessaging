import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

dotenv.config();

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Dynamic Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Detect whether file is image or video
    const isVideo = file.mimetype.startsWith("video/");
    return {
      folder: isVideo ? "MessageVideos" : "MessageImages",
      resource_type: isVideo ? "video" : "image", // VERY important for videos
      allowed_formats: isVideo
        ? ["mp4", "mov", "avi"]
        : ["jpg", "jpeg", "png", "webp"],
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

export { cloudinary, storage };
