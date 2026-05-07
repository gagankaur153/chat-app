
// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// require("dotenv").config({ quiet: true });
// const cookieParser = require("cookie-parser")
// const authroute = require("./routes/authroute");
// const messageroute = require("./routes/messageroute");
// const usersroute = require("./routes/usersroute")
// const dns = require("node:dns")

// dns.setServers(["8.8.8.8", "8.8.4.4"])

// // create express app and http server
// const {app, server} = require('./Socket/socket.js')

// const mongoUri = process.env.MONGODB_URI || process.env.URI;
// const PORT = process.env.PORT || 5001;

// let cachedConnection = global.mongooseConnection;
// let cachedConnectionPromise = global.mongooseConnectionPromise;

// const connectDB = async () => {
//   if (cachedConnection) {
//     return cachedConnection;
//   }

//   if (!mongoUri) {
//     throw new Error("MONGODB_URI is missing");
//   }

//   if (!cachedConnectionPromise) {
//     cachedConnectionPromise = mongoose.connect(mongoUri, {
//       connectTimeoutMS: 10000,
//       socketTimeoutMS: 45000,
//     });

//     global.mongooseConnectionPromise = cachedConnectionPromise;
//   }

//   cachedConnection = await cachedConnectionPromise;
//   global.mongooseConnection = cachedConnection;
//   return cachedConnection;
// };

// const defaultClientOrigins = [
//   "http://localhost:5173",
//   "https://chatapptalk.vercel.app",
// ];

// const allowedOrigins = [
//   ...defaultClientOrigins,
//   process.env.CLIENT_URL,
//   process.env.CLIENT_ORIGINS,
// ]
//   .filter(Boolean)
//   .join(",")
//   .split(",")
//   .map((origin) => origin.trim())
//   .filter(Boolean);

// const isAllowedOrigin = (origin) => {
//   if (!origin) {
//     return true;
//   }

//   return allowedOrigins.includes(origin);
// };


// // middleware
// app.set("trust proxy", 1);
// const corsOptions = {
//   origin: (origin, callback) => {
//     if (isAllowedOrigin(origin)) {
//       return callback(null, true);
//     }

//     return callback(new Error("Not allowed by CORS"));
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

// app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));
// app.use(express.json());
// app.use(cookieParser());

// app.get('/api/health', (req, res) => res.status(200).json({ status: "ok" }));

// app.use("/api", async (req, res, next) => {
//   try {
//     await connectDB();
//     next();
//   } catch (err) {
//     console.error("MongoDB Connection Error:", err);
//     res.status(500).json({ message: "Database connection error" });
//   }
// });

// // routes
// app.use('/api/auth', authroute);
// app.use('/api/message', messageroute)
// app.use('/api/users', usersroute)

// app.get('/', (req, res) => res.send("server runner"));



// // socket setup
// // const io = new Server(server, {
// //   cors: {
// //     origin: "http://localhost:5173",
// //     credentials: true
// //   },
// // });

// // io.on("connection", (socket) => {
// //   console.log("User connected:", socket.id);

// // //   // ✅ Send welcome immediately after connection
// //   socket.broadcast.emit("welcome", `Welcome to the server ${socket.id}`);

// //   socket.on("send_message", (data) => {
// //     console.log( data);
// //   });

// //   socket.on("msg", (m)=> {
// //     console.log(m)
// // io.emit("receive", m)
// // }
// // );

// // })

// if (require.main === module) {
//   connectDB()
//     .then(() => {
//       console.log("MongoDB Connected");
//       if (!server) {
//         throw new Error("HTTP server is not available in this environment");
//       }

//       server.listen(PORT, () => {
//         console.log(`Server running on port ${PORT}`);
//       });
//     })
//     .catch(err => {
//       console.error("MongoDB Connection Error:", err);
//       process.exit(1);
//   });
// }

// module.exports = app;


const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config({ quiet: true });

const cookieParser = require("cookie-parser");

const authroute = require("./routes/authroute");
const messageroute = require("./routes/messageroute");
const usersroute = require("./routes/usersroute");

const dns = require("node:dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

// socket import
const { app, server } = require("./Socket/socket.js");

const mongoUri = process.env.MONGODB_URI || process.env.URI;
const PORT = process.env.PORT || 5001;

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://chatapptalk.vercel.app",
  "https://chat-app-three-taupe.vercel.app/"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authroute);
app.use("/api/message", messageroute);
app.use("/api/users", usersroute);

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

// start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});