import { useState } from "react";
import { socket } from "../../socket";
import './SessionPage.css';
export default function SessionPage() {
  const [roomId, setRoomId] = useState("");

  const createRoom = () => {
    const newRoom = Math.random().toString(36).substr(2, 10);
    socket.emit("join-room", newRoom);
    window.location.href = `/editor/${newRoom}`;
  };

  const joinRoom = () => {
    socket.emit("join-room", roomId);
    window.location.href = `/editor/${roomId}`;
  };

  return (
    <div className="session-page">
      <h1>Start a Collaboration Session</h1>
      <button onClick={createRoom}>Create Session</button>
      <input 
        placeholder="Enter Room ID" 
        onChange={(e) => setRoomId(e.target.value)} 
        value={roomId}
      />
      <button onClick={joinRoom} disabled={!roomId}>Join Session</button>
    </div>
  );
}
