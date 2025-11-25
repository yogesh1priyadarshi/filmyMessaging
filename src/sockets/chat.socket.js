import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";

export const chatSocket = (io) => {
  io.on("connection", (socket) => {
    
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined`);
    });

    socket.on("getMessages", async ({ conversationId, userId }, callback) => {
      try {
        if (!conversationId) {
          console.warn("⚠️ Missing conversationId in getMessages request");
          return callback({
            success: false,
            messages: [],
            error: "Conversation ID is required",
          });
        }

        // ✅ Fetch messages excluding soft-deleted ones and messages deleted for this user
        const messages = await Message.find({
          conversation: conversationId,
          isDeleted: { $ne: true }, // exclude globally deleted
          deletedFor: { $ne: userId }, // exclude deleted-for-me messages
        })
          .sort({ createdAt: 1 })
          .lean();

        // ✅ Optional: mark messages as read
        if (userId) {
          await Message.updateMany(
            { conversation: conversationId, readBy: { $ne: userId } },
            { $push: { readBy: userId } }
          );
        }

        callback(messages);
      } catch (error) {
        console.error("❌ Error fetching messages:", error.message);
        callback({
          success: false,
          messages: [],
          error: "Failed to load messages. Please try again.",
        });
      }
    });

    socket.on("sendMessage", async (data) => {
      const { conversationId, sender, content, type = "text", mediaUrl } = data;
      if (!conversationId) {
        return;
      }
      const message = await Message.create({
        conversation: conversationId,
        sender,
        content,
        type,
        mediaUrl,
      });
      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: message._id,
      });
      const convo = await Conversation.findById(conversationId);
      console.log("convo of id with", conversationId, convo);
      if (!convo) {
        return;
      }
      convo.participants.forEach((userId) => {
        if (userId.toString() !== sender)
          io.to(userId.toString()).emit("receiveMessage", message);
      });
    });

    // ✅ "Delete for me"
    socket.on("deleteMessageForMe", async ({ messageId, userId }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) return;

        if (!message.deletedFor.includes(userId)) {
          message.deletedFor.push(userId);
          await message.save();
        }

        // Emit update only to this user
        io.to(userId).emit("messageDeletedForMe", { messageId });
      } catch (error) {
        console.error("Error in deleteMessageForMe:", error);
      }
    });

    socket.on(
      "deleteMessageForAll",
      async ({ messageId, userId, conversationId }) => {
        try {
          const message = await Message.findById(messageId);
          if (!message) return;

          // Only sender can delete for all
          if (message.sender.toString() !== userId) return;

          message.isDeleted = true;
          message.deletedAt = new Date();
          await message.save();

          // Notify everyone in the conversation
          io.to(userId).emit("messageDeletedForAll", { messageId });
        } catch (error) {
          console.error("Error in deleteMessageForAll:", error);
        }
      }
    );

    socket.on("mark_as_read", async ({ messageId, userId }) => {
      await Message.findByIdAndUpdate(messageId, {
        $addToSet: { readBy: userId },
      });
      io.emit("message_read", { messageId, reader: userId });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};
