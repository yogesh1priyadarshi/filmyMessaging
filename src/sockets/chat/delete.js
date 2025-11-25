import Message from "../../models/messageModel.js";

export default function deleteHandlers(io, socket) {

  socket.on("deleteMessageForMe", async ({ messageId, userId }) => {
    try {
      const message = await Message.findById(messageId);
      if (!message) return;

      if (!message.deletedFor.includes(userId)) {
        message.deletedFor.push(userId);
        await message.save();
      }

      io.to(userId).emit("messageDeletedForMe", { messageId });
    } catch (err) {
      console.error("Error deleteMessageForMe:", err);
    }
  });

  socket.on("deleteMessageForAll", async ({ messageId, userId }) => {
    try {
      const message = await Message.findById(messageId);
      if (!message) return;

      if (message.sender.toString() !== userId) return;

      message.isDeleted = true;
      message.deletedAt = new Date();
      await message.save();

      io.emit("messageDeletedForAll", { messageId });
    } catch (err) {
      console.error("Error deleteMessageForAll:", err);
    }
  });
}
