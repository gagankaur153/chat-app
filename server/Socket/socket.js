// // const { Server } = require("socket.io");
// // const http = require("http");
// // const express = require("express");

// // const app = express();
// // const isServerless = Boolean(process.env.VERCEL);
// // const server = isServerless ? null : http.createServer(app);
// // const defaultClientOrigins = [
// //   "http://localhost:5173",
// //   "https://chatapptalk.vercel.app",
// // ];
// // const allowedOrigins = [
// //   ...defaultClientOrigins,
// //   process.env.CLIENT_URL,
// //   process.env.CLIENT_ORIGINS,
// // ]
// //   .filter(Boolean)
// //   .join(",")
// //   .split(",")
// //   .map((origin) => origin.trim())
// //   .filter(Boolean);

// // const createNoopIo = () => ({
// //   emit: () => {},
// //   on: () => {},
// //   to: () => ({ emit: () => {} }),
// // });

// // const io = isServerless
// //   ? createNoopIo()
// //   : new Server(server, {
// //       cors: {
// //         origin: allowedOrigins,
// //         methods: ["GET", "POST"],
// //         credentials: true
// //       },
// //     });

// // const userSocketMap = {}; // { userId : socketId }

// // const getReceiverSocketId = (receiverId) => {
// //   return userSocketMap[receiverId];
// // };

// // if (!isServerless) {
// //   io.on("connection", (socket) => {
// //     const userId = socket.handshake.query.userId;

// //     if (userId && userId !== "undefined") {
// //       userSocketMap[userId] = socket.id;
// //     }

// //     io.emit("getOnlineUsers", Object.keys(userSocketMap));

// //     socket.on("disconnect", () => {
// //       delete userSocketMap[userId];
// //       io.emit("getOnlineUsers", Object.keys(userSocketMap));
// //     });
// //   });
// // }

// // module.exports = {
// //   app,
// //   server,
// //   io,
// //   getReceiverSocketId,
// // };


// const { Server } = require("socket.io");
// const http = require("http");
// const express = require("express");

// const app = express();
// const server = http.createServer(app);

// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://chatapptalk.vercel.app",
// ];

// const io = new Server(server, {
//   cors: {
//     origin: allowedOrigins,
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// const userSocketMap = {};

// const getReceiverSocketId = (receiverId) => {
//   return userSocketMap[receiverId];
// };

// io.on("connection", (socket) => {
//   const userId = socket.handshake.query.userId;

//   if (userId && userId !== "undefined") {
//     userSocketMap[userId] = socket.id;
//   }

//   io.emit("getOnlineUsers", Object.keys(userSocketMap));

//   socket.on("disconnect", () => {
//     delete userSocketMap[userId];
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));
//   });
// });

// module.exports = {
//   app,
//   server,
//   io,
//   getReceiverSocketId,
// };


const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
   "https://chat-app-three-taupe.vercel.app",
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSocketMap = {};

const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);

    delete userSocketMap[userId];

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = {
  app,
  server,
  io,
  getReceiverSocketId,
};