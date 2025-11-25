import express from "express";
import messageRoutes from "../routes/message.routes.js";
import conversationRoutes from "../routes/conversation.routes.js";
import { uploadOnCloudinary } from "../controllers/upload.controler.js";
import upload from "../middlewares/uploadCloudinary.js";

const router = express.Router();

router.use("/messages", messageRoutes);

router.use("/conversations", conversationRoutes);

router.post("/upload",upload.single("media"),uploadOnCloudinary);

export default router;