

const Conversation = require("../models/conversationmodel");
const Message = require("../models/messagemodel");
const User = require("../models/usermodel");
const { getReceiverSocketId, io } = require("../Socket/socket");

// get all users
const alluser = async (req, res) => {
  try {
    const id = req.user?.id;

    const fetchalluser = await User.find({
      _id: { $ne: id },
    }).select("-password");

    if (fetchalluser.length === 0) {
      return res.status(400).json({ message: "user not found" });
    }

    res.status(200).json({ data: fetchalluser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// send message
const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const receiverId = req.params?.id;
    const senderId = req.user?.id;

    let chats = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!chats) {
      chats = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      conversationId: chats._id,
    });

    if (newMessage) {
      chats.message.push(newMessage._id);
    }

    await Promise.all([chats.save(), newMessage.save()]);

    // socket io
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// get messages
const getMessage = async (req, res) => {
  try {
    const receiverId = req.params?.id;
    const senderId = req.user?.id;

    const chats = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("message");

    if (!chats) {
      return res.status(200).json([]);
    }

    res.status(200).json(chats.message);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  alluser,
  sendMessage,
  getMessage,
};