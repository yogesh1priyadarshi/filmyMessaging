import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    admin: { type: mongoose.Schema.Types.ObjectId, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId }],
    description: String,
    image: String, // optional group profile pic
  },
  { timestamps: true }
);

export default mongoose.model("Group", groupSchema);
