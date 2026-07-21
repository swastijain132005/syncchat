import mongoose from "mongoose";
import usermodel from "./user.model.js";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    reactions: [
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    emoji: {
      type: String,
      required: true,
    },

    reactedAt: {
      type: Date,
      default: Date.now,
    },
  },
],
    image: {
      type: String,
    },
    seen: {
      type: Boolean,
      default: false,
    },

     // NEW
    edited: {
      type: Boolean,
      default: false,
    },

    // NEW
    editedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;