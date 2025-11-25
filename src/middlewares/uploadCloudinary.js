import multer from "multer";
import {storage} from "../config/cloudinary.js"

const fileFilter = (req, file, cb) => {
  console.log("Uploaded file MIME type:", file.mimetype);

  if (file.mimetype.startsWith("image/")) {
    console.log("✅ It's an image");
    cb(null, true);
  } else if (file.mimetype.startsWith("video/")) {
    console.log("🎥 It's a video");
    cb(null, true);
  } else {
    console.log("❌ Not allowed file type:", file.mimetype);
    cb(new Error("Unsupported file type"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;

