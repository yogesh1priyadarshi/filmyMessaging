import express from "express";
import {
  createConversation,
  getUserConversations,
  getConversationById,
  getOrCreateConversation,
  createGroupConversation,
} from "../controllers/conversation.controller.js";

const router = express.Router();

router.post("/", getOrCreateConversation);      // 1-to-1 chat
router.post("/groups", createGroupConversation); // group chat

//router.post("/", createConversation); // create new 1:1 or group chat
router.get("/:userId", getUserConversations); // get all convos of a user
router.get("/details/:id", getConversationById); // get single convo details


export default  router;