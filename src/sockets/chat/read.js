import Message from "../../models/messageModel.js";

export default function readHandlers(io, socket) {
  socket.on("mark_as_read", async ({ messageId, userId }) => {
    await Message.findByIdAndUpdate(messageId, {
      $addToSet: { readBy: userId },
    });

    io.emit("message_read", { messageId, reader: userId });
  });
}
