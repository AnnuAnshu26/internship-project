import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./src/config/db.js";

import authRoutes from "./src/routes/auth.js";
import teamRoutes from "./src/routes/team.js";
import chatRoutes from "./src/routes/chat.js";
import fileRoutes from "./src/routes/file.js";
import taskRoutes from "./src/routes/tasks.js";
import notificationRoutes from "./src/routes/notifications.js";
import aiRoutes from "./src/routes/ai.js";
import Message from "./src/models/Message.js";

dotenv.config();
const app = express();

/* ------------------------- 🔧 GLOBAL MIDDLEWARES ------------------------- */
app.use(express.json());
app.use(morgan("dev"));

app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:3000",
      "https://teamifyai.vercel.app", // ✅ allow your deployed frontend
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

/* --------------------------- 🚀 API ROUTES ------------------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ai", aiRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "✅ Server is live!", time: new Date().toISOString() });
});

/* ---------------------- 💬 SOCKET.IO CONFIG ------------------------------- */
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      process.env.CLIENT_URL || "http://localhost:3000",
      "https://teamifyai.vercel.app", // ✅ match frontend
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// Store connected users (optional improvement)
const activeUsers = new Map();

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // Join team room
  socket.on("join_team", (teamId) => {
    socket.join(teamId);
    activeUsers.set(socket.id, teamId);
    console.log(`🔵 User ${socket.id} joined team room: ${teamId}`);
  });

  // Handle chat messages
  socket.on("send_message", async (data) => {
    try {
      if (!data.teamId || !data.text) {
        console.log("❌ Invalid message payload:", data);
        return;
      }

      console.log(`📩 ${data.senderName} → Team ${data.teamId}: ${data.text}`);

      const newMessage = await Message.create({
        teamId: data.teamId,
        senderId: data.senderId,
        senderName: data.senderName,
        text: data.text,
      });

      io.to(data.teamId).emit("receive_message", {
        _id: newMessage._id,
        senderId: newMessage.senderId,
        senderName: newMessage.senderName,
        text: newMessage.text,
        createdAt: newMessage.createdAt,
      });
    } catch (err) {
      console.error("❌ Message Save Error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
    activeUsers.delete(socket.id);
  });
});

/* -------------------------- ⚡ SERVER START ------------------------------ */
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Allowed Origins: ${process.env.CLIENT_URL || "http://localhost:3000"}, https://teamifyai.vercel.app`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err);
  });
