import Message from "../../models/messageModel.js";
import Conversation from "../../models/conversationModel.js";

export default function sendHandlers(io, socket) {
  socket.on("sendMessage", async (data) => {
    const { conversationId, sender, content, type = "text", mediaUrl } = data;

    if (!conversationId) return;

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
    if (!convo) return;

    convo.participants.forEach((userId) => {
      if (userId.toString() !== sender)
        io.to(userId.toString()).emit("receiveMessage", message);
    });
  });
}
