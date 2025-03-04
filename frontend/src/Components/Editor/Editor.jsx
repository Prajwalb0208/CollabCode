import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../../socket";
import MonacoEditor from "@monaco-editor/react";

export default function Editor() {
  const { roomId } = useParams();
  const [code, setCode] = useState("// Start coding...");
  const [typingUser, setTypingUser] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const videoRef = useRef(null);
  const peerVideosRef = useRef({});

  useEffect(() => {
    socket.emit("join-room", roomId);

    socket.on("receive-code", (newCode) => {
      setCode(newCode);
    });

    socket.on("typing", (userId) => {
      setTypingUser(userId);
      setTimeout(() => setTypingUser(null), 2000);
    });

    socket.on("cursor-move", ({ userId, position }) => {
      document.querySelector(`[data-user="${userId}"]`)?.style.setProperty("left", position.x + "px");
      document.querySelector(`[data-user="${userId}"]`)?.style.setProperty("top", position.y + "px");
    });

    socket.on("user-joined", (userId) => {
      setParticipants((prev) => [...prev, userId]);
    });

    socket.on("user-left", (userId) => {
      setParticipants((prev) => prev.filter((id) => id !== userId));
    });

    return () => {
      socket.off("receive-code");
      socket.off("typing");
      socket.off("cursor-move");
      socket.off("user-joined");
      socket.off("user-left");
    };
  }, [roomId]);

  const handleCodeChange = (newValue) => {
    setCode(newValue);
    socket.emit("code-changed", { roomId, code: newValue });
    socket.emit("typing", socket.id);
  };

  const handleCursorMove = (e) => {
    socket.emit("cursor-move", {
      roomId,
      userId: socket.id,
      position: { x: e.clientX, y: e.clientY },
    });
  };

  const toggleAudio = () => {
    setIsAudioMuted(!isAudioMuted);
    videoRef.current.srcObject.getAudioTracks().forEach(track => track.enabled = isAudioMuted);
  };

  const toggleVideo = () => {
    setIsVideoMuted(!isVideoMuted);
    videoRef.current.srcObject.getVideoTracks().forEach(track => track.enabled = isVideoMuted);
  };

  const setupPeerConnection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = stream;

      socket.emit("start-call", { roomId });

      // Sending our stream to others
      socket.on("user-joined", (userId) => {
        if (!peerVideosRef.current[userId]) {
          const videoElement = document.createElement("video");
          videoElement.classList.add("peer-video");
          videoElement.setAttribute("autoplay", true);
          videoElement.setAttribute("playsinline", true);
          peerVideosRef.current[userId] = videoElement;
          document.querySelector(".video-section").appendChild(videoElement);
        }
      });

      // Receiving other users' streams
      socket.on("stream-received", ({ userId, stream }) => {
        if (peerVideosRef.current[userId]) {
          peerVideosRef.current[userId].srcObject = stream;
        }
      });

      // Send stream to all peers
      stream.getTracks().forEach((track) => {
        Object.values(peerVideosRef.current).forEach((peer) => {
          if (peer.srcObject) {
            peer.srcObject.addTrack(track, stream);
          }
        });
      });

    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };


  return (
    <div className="container">
      <div className="editor-section">
        <h1>Collaborative Code Editor - Room {roomId}</h1>
        {typingUser && <p className="typing-indicator">{typingUser} is typing...</p>}

        <MonacoEditor
          height="600px"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={code}
          onChange={handleCodeChange}
          onMouseMove={handleCursorMove}
        />

        <div className="controls">
          <button onClick={setupPeerConnection}>Start Video Call</button>
          <button onClick={toggleAudio}>{isAudioMuted ? "Unmute" : "Mute"} Audio</button>
          <button onClick={toggleVideo}>{isVideoMuted ? "Turn On" : "Turn Off"} Video</button>
        </div>
      </div>

      <div className="video-section">
        <video ref={videoRef} autoPlay playsInline muted={isAudioMuted} className="self-video" />

        {/* This ensures correct refs for peer videos */}
        {participants.map((userId) => (
          <video key={userId} ref={(el) => {
            if (el) peerVideosRef.current[userId] = el;
          }} autoPlay playsInline className="peer-video" />
        ))}
      </div>

    </div>
  );
}
