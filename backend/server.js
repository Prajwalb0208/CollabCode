import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

app.get("/", (req, res) => res.send("CollabCode Backend Running"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port :http://localhost:${PORT}`));
