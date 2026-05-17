

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

const createGroup = async (req, res) => {
  try {
    const { groupName, members } = req.body;
    const adminId = req.user?.id;

    if (!groupName?.trim()) {
      return res.status(400).json({ message: "Group name is required" });
    }

    if (!Array.isArray(members) || members.length < 2) {
      return res.status(400).json({ message: "Select at least 2 members" });
    }

    const participants = [...new Set([...members, adminId])];

    const group = await Conversation.create({
      isGroupChat: true,
      groupName: groupName.trim(),
      groupAdmin: adminId,
      participants,
    });

    const populatedGroup = await Conversation.findById(group._id)
      .populate("participants", "-password")
      .populate("groupAdmin", "-password");

    participants.forEach((participantId) => {
      if (participantId.toString() === adminId.toString()) return;

      const socketId = getReceiverSocketId(participantId.toString());
      if (socketId) {
        io.to(socketId).emit("newGroup", populatedGroup);
      }
    });

    res.status(201).json(populatedGroup);
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
      isGroupChat: false,
      participants: { $all: [senderId, receiverId] },
    });

    if (!chats) {
      chats = await Conversation.create({
        isGroupChat: false,
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

const sendGroupMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const conversationId = req.params?.id;
    const senderId = req.user?.id;

    if (!message?.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const group = await Conversation.findOne({
      _id: conversationId,
      isGroupChat: true,
      participants: senderId,
    });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const newMessage = await Message.create({
      senderId,
      message,
      conversationId: group._id,
    });

    group.message.push(newMessage._id);
    await group.save();

    const populatedMessage = await Message.findById(newMessage._id).populate(
      "senderId",
      "-password"
    );

    group.participants.forEach((participantId) => {
      if (participantId.toString() === senderId.toString()) return;

      const socketId = getReceiverSocketId(participantId.toString());
      if (socketId) {
        io.to(socketId).emit("newMessage", populatedMessage);
      }
    });

    res.status(201).json(populatedMessage);
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
      isGroupChat: false,
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

const getGroupMessage = async (req, res) => {
  try {
    const conversationId = req.params?.id;
    const senderId = req.user?.id;

    const group = await Conversation.findOne({
      _id: conversationId,
      isGroupChat: true,
      participants: senderId,
    }).populate({
      path: "message",
      populate: {
        path: "senderId",
        select: "-password",
      },
    });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json(group.message);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  alluser,
  createGroup,
  sendMessage,
  sendGroupMessage,
  getMessage,
  getGroupMessage,
};
