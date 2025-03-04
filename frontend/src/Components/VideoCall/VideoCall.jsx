import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../../socket";

export default function VideoCall() {
  const { roomId } = useParams();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      localVideoRef.current.srcObject = stream;
      peerConnection.current = new RTCPeerConnection();
      stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));

      peerConnection.current.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("signal", { roomId, signalData: event.candidate });
        }
      };

      socket.on("signal", ({ signalData }) => {
        if (signalData.candidate) {
          peerConnection.current.addIceCandidate(new RTCIceCandidate(signalData.candidate));
        }
      });

      peerConnection.current.createOffer().then((offer) => {
        peerConnection.current.setLocalDescription(offer);
        socket.emit("signal", { roomId, signalData: offer });
      });

      socket.on("signal", ({ signalData }) => {
        if (signalData.type === "offer") {
          peerConnection.current.setRemoteDescription(new RTCSessionDescription(signalData));
          peerConnection.current.createAnswer().then((answer) => {
            peerConnection.current.setLocalDescription(answer);
            socket.emit("signal", { roomId, signalData: answer });
          });
        } else if (signalData.type === "answer") {
          peerConnection.current.setRemoteDescription(new RTCSessionDescription(signalData));
        }
      });
    });

    return () => {
      peerConnection.current?.close();
      socket.off("signal");
    };
  }, [roomId]);

  return (
    <div>
      <h1>Video Call - Room {roomId}</h1>
      <video ref={localVideoRef} autoPlay playsInline muted />
      <video ref={remoteVideoRef} autoPlay playsInline />
    </div>
  );
}
