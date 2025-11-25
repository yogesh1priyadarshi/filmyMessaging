import Message from "../../models/messageModel.js";

export default function messageHandlers(io, socket) {

  socket.on("getMessages", async ({ conversationId, userId }, callback) => {
    try {
      if (!conversationId) {
        return callback({
          success: false,
          messages: [],
          error: "Conversation ID is required",
        });
      }

      const messages = await Message.find({
        conversation: conversationId,
        isDeleted: { $ne: true },
        deletedFor: { $ne: userId },
      })
        .sort({ createdAt: 1 })
        .lean();

      if (userId) {
        await Message.updateMany(
          { conversation: conversationId, readBy: { $ne: userId } },
          { $push: { readBy: userId } }
        );
      }

      callback(messages);
    } catch (error) {
      console.error("Error fetching messages:", error.message);
      callback({
        success: false,
        messages: [],
        error: "Failed to load messages",
      });
    }
  });
}
