import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function App() {
  useEffect(() => {
    socket.on("connect", () => console.log("Connected to server:", socket.id));

    return () => socket.disconnect();
  }, []);

  return <h1 className="text-2xl font-bold">CollabCode Frontend</h1>;
}
