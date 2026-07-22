import Message from "../model/message.model.js";
import User from "../model/user.model.js";
import cloudinary from "../LIB/cloudinary.js";
import { io, usersocketmap } from "../server.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user._id;

        const filteredUsers = await User.find({
            _id: { $ne: userId },
        }).select("-password");

        // Count number of messages not seen
        const unseenMessages = {};

        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({
                senderId: user._id,
                receiverId: userId,
                seen: false,
            });

            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length;
            }
        });

        await Promise.all(promises);

        res.json({
            success: true,
            users: filteredUsers,
            unseenMessages,
        });

    } catch (error) {
        console.log(error.message);

        res.json({
            success: false,
            message: error.message,
        });
    }
};


// Get all messages for selected user
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });

    await Message.updateMany(
    {
        senderId: selectedUserId,
        receiverId: myId,
        seen: false,
    },
    {
        seen: true,
    }
);

// Get all newly seen messages
const seenMessages = await Message.find({
    senderId: selectedUserId,
    receiverId: myId,
    seen: true,
});

const senderSocketId = usersocketmap[selectedUserId];

if (senderSocketId) {
    io.to(senderSocketId).emit(
        "messagesSeen",
        seenMessages
    );
}

res.json({
    success: true,
    messages,
});

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to mark message as seen using message id
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;

    await Message.findByIdAndUpdate(id, { seen: true });

    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    // (Socket emit code usually comes here)
    // Emit the new message to the receiver if they are online
    const receiverSocketId = usersocketmap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.json({
      success: true,
      newMessage,
    });

  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const editMessage = async (req, res) => {
    try {
        console.log("Params:", req.params);
console.log("MessageId:", req.params.messageId);

        const { messageId } = req.params;
        const { text } = req.body;

        if (!text || text.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Message cannot be empty",
            });
        }

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            });
        }

        // Only sender can edit
        if (message.senderId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can edit only your own messages.",
            });
        }

        message.text = text;
        message.edited = true;
        message.editedAt = new Date();

        await message.save();

        return res.status(200).json({
            success: true,
            message: "Message updated",
            updatedMessage: message,
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

export const deleteMessage = async (req, res) => {

    try {

        const { messageId } = req.params;

        const message = await Message.findById(messageId);

        if (!message) {

            return res.status(404).json({

                success: false,

                message: "Message not found",

            });

        }

        // Only sender can delete
        if (message.senderId.toString() !== req.user._id.toString()) {

            return res.status(403).json({

                success: false,

                message: "You can delete only your own messages.",

            });

        }

        await Message.findByIdAndDelete(messageId);

        return res.status(200).json({

            success: true,

            message: "Message deleted",

            deletedId: messageId,

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

export const reactToMessage = async (req, res) => {
    try {

        const { messageId } = req.params;
        const { emoji } = req.body;
        const userId = req.user._id;

        // Validate
        if (!emoji) {
            return res.status(400).json({
                success: false,
                message: "Emoji is required",
            });
        }

        // Find message
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            });
        }

        // Find existing reaction
        const reactionIndex = message.reactions.findIndex(
            (reaction) =>
                reaction.userId.toString() === userId.toString()
        );

        // User has never reacted
        if (reactionIndex === -1) {

            message.reactions.push({
                userId,
                emoji,
            });

        } else {

            // Same emoji -> remove reaction
            if (
                message.reactions[reactionIndex].emoji === emoji
            ) {

                message.reactions.splice(reactionIndex, 1);

            }

            // Different emoji -> replace reaction
            else {

                message.reactions[reactionIndex].emoji = emoji;

                message.reactions[reactionIndex].reactedAt = new Date();

            }
        }

        await message.save();

        const receiverSocketId =
usersocketmap[message.receiverId];

const senderSocketId =
usersocketmap[message.senderId];
if (receiverSocketId) {
    io.to(receiverSocketId).emit("newReaction", message);
}
if (senderSocketId) {
    io.to(senderSocketId).emit("newReaction", message);
}


        return res.status(200).json({
            success: true,
            updatedMessage: message,
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};