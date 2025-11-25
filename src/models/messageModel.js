import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, trim: true },
    type: {
      type: String,
      enum: ["text", "image", "video", "file", "audio"],
      default: "text",
    },
    media: {
      url: String,
      format: String,
      size: Number,
      duration: Number,
    },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // 🔥 Soft delete (for all)
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },

    // 🧍‍♂️ Per-user delete (only hides for specific users)
    deletedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // ✏️ Edit tracking
    isEdited: { type: Boolean, default: false },
    editedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

messageSchema.index({ conversation: 1, createdAt: -1 });

export default mongoose.model("Message", messageSchema);
