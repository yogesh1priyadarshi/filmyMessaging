import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";


// PATCH /messages/:id/delete-for-me
export const deleteMessageForMe = async (req, res) => {
  const userId = req.user.id; // From auth middleware
  const messageId = req.params.id;

  const message = await Message.findById(messageId);
  if (!message) return res.status(404).json({ error: "Message not found" });

  // Add user to deletedFor array (if not already there)
  if (!message.deletedFor.includes(userId)) {
    message.deletedFor.push(userId);
    await message.save();
  }

  res.json({ message: "Message deleted for you" });
};

// PATCH /messages/:id/delete-for-all
export const deleteMessageForAll = async (req, res) => {
  const messageId = req.params.id;
  const userId = req.user.id;

  const message = await Message.findById(messageId);
  if (!message) return res.status(404).json({ error: "Message not found" });

  // Optional: Allow only sender to delete for all
  if (message.sender.toString() !== userId)
    return res.status(403).json({ error: "Not authorized" });

  message.isDeleted = true;
  message.deletedAt = new Date();
  await message.save();

  res.json({ message: "Message deleted for everyone" });
};

// ✅ Send a message via REST
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, content, type } = req.body;

    if (!conversationId || !senderId || !content) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: senderId,
      content,
      type,
    });

    await Conversation.findByIdAndUpdate(conversationId, { lastMessage: message._id });

    res.status(201).json({ success: true, message });
  } catch (err) {
    console.error("sendMessage:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Fetch all messages in a conversation
export const getMessagesByConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversation: conversationId }).sort({ createdAt: 1 });

    res.status(200).json({ success: true, messages });
  } catch (err) {
    console.error("getMessagesByConversation:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Mark a message as read
export const markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.body;

    const message = await Message.findByIdAndUpdate(
      messageId,
      { $addToSet: { readBy: userId } },
      { new: true }
    );

    res.status(200).json({ success: true, message });
  } catch (err) {
    console.error("markMessageAsRead:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
