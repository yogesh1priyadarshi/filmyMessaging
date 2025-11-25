import express from "express"
import upload from "../middlewares/uploadCloudinary.js";
import { uploadOnCloudinary } from "../controllers/upload.controler.js";

const router = express.Router();
console.log("arrived upload router post")
router.post("/",upload.single("media"),uploadOnCloudinary);

export default router;