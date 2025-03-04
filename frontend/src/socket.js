import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000"; // Change if different

export const socket = io(SOCKET_SERVER_URL, {
    transports: ["websocket"],
});
