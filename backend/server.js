import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

const rooms = {}; // Stores active rooms and their data

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // User joins a room
  socket.on("join-room", (roomId) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = {
        users: [],
        code: "// Start coding..."
      };
    }

    rooms[roomId].users.push(socket.id);
    console.log(`User ${socket.id} joined room: ${roomId}`);

    // Send existing code to the new user
    socket.emit("receive-code", rooms[roomId].code);

    // Notify others that a new user joined
    socket.to(roomId).emit("user-joined", socket.id);
  });

  // Handle code changes
  socket.on("code-changed", ({ roomId, code }) => {
    if (rooms[roomId]) {
      rooms[roomId].code = code; // Store latest code
    }
    socket.to(roomId).emit("receive-code", code);
  });

  // Handle WebRTC signaling for video call
  socket.on("signal", ({ roomId, signalData, from }) => {
    socket.to(roomId).emit("signal", { signalData, from });
  });

  // Notify users when someone leaves
  socket.on("disconnect", () => {
    Object.keys(rooms).forEach((roomId) => {
      if (rooms[roomId]) {
        rooms[roomId].users = rooms[roomId].users.filter((id) => id !== socket.id);
        if (rooms[roomId].users.length === 0) delete rooms[roomId];
      }
    });
    console.log(`User ${socket.id} disconnected`);
  });
});

// API Route (Optional)
app.get("/", (req, res) => {
  res.send("CollabCode Server is running!");
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
