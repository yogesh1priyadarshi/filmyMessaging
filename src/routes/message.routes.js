import express from "express";
import {
  sendMessage,
  getMessagesByConversation,
  markMessageAsRead,
} from "../controllers/message.controller.js";

const router = express.Router();

router.post("/", sendMessage); // send message (REST-based)
router.get("/:conversationId", getMessagesByConversation); // get all messages in a conversation
router.patch("/read/:messageId", markMessageAsRead); // mark as read

export default  router;