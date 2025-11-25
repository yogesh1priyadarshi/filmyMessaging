import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import Conversation from "../models/conversationModel.js";
const USER_API = process.env.USER_API;

// 🧍‍♂️ One-to-One
export const getOrCreateConversation = async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    let conversation = await Conversation.findOne({
      isGroup: false,
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👥 Group Chat
export const createGroupConversation = async (req, res) => {
  const { groupName, participants, adminId } = req.body;
  try {
    const groupConversation = await Conversation.create({
      isGroup: true,
      groupName,
      participants,
      groupAdmins:[adminId]
    });
    res.status(201).json(groupConversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Create new conversation (1:1 or group)
export const createConversation = async (req, res) => {
  try {
    const { participants, isGroup, groupName, groupAdmin } = req.body;

    if (!participants || participants.length < 2) {
      return res.status(400).json({ success: false, message: "At least 2 participants required" });
    }

    // For 1:1 chat, check if conversation already exists
    if (!isGroup) {
      const existing = await Conversation.findOne({
        participants: { $all: participants, $size: 2 },
        isGroup: false,
      });
      if (existing) return res.status(200).json({ success: true, conversation: existing });
    }

    const conversation = await Conversation.create({
      participants,
      isGroup,
      groupName,
      groupAdmin,
    });

    res.status(201).json({ success: true, conversation });
  } catch (err) {
    console.error("createConversation:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Get all conversations for a user
export const getUserConversations = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = [];

    const conversations = await Conversation.find({
      participants: { $in: [userId] },
    })
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

console.log("USER API "+USER_API);
         for (let conversation of conversations) {
      const participantIds = conversation.participants;

      const usersRes = await axios.post(`${USER_API}/users/bulk`, {
        ids: participantIds
      });
      console.log("all detail of participats", usersRes.data);
  const obj = conversation.toObject();
  obj.participantDetails=usersRes.data.users;

result.push(obj);
       conversation.participantDetails = usersRes.data.users;
    }
    res.status(200).json({ success: true, conversations:result });
  } catch (err) {
    console.error("getUserConversations:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Get specific conversation details
export const getConversationById = async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = await Conversation.findById(id)
      .populate("lastMessage");

    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    res.status(200).json({ success: true, conversation });
  } catch (err) {
    console.error("getConversationById:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
