import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../providers/SocketContext.jsx";
import { usePeer } from "../providers/peer.jsx";
import ReactPlayer from "react-player";
const Room = () => {
  const { socket } = useSocket();
  const {
    peer,
    createOffer,
    createAnswer,
    remoteStream,
    setRemoteAns,
    sendStream,
  } = usePeer();
  const [myStream, setMyStream] = useState(null);
  const [remoteEmailId, setRemoteEmailId] = useState(null);

  const handleNewUserJoined = useCallback(
    async (data) => {
      const { emailId } = data;
      console.log("New user joined room", emailId);
      const offer = await createOffer();
      socket.emit("call-user", { emailId, offer });
      setRemoteEmailId(emailId);
    },
    [createOffer, socket]
  );

  const handleIncomingCall = useCallback(
    async (data) => {
      const { from, offer } = data;
      console.log(from, offer);
      const ans = await createAnswer(offer);
      socket.emit("call-accept", { emailId: from, ans });
      setRemoteEmailId(from);
    },
    [socket, createAnswer]
  );

  const handleCallAccepted = useCallback(
    async (data) => {
      const { ans } = data;
      // console.log(data);
      console.log("Call got accepted", ans);
      await setRemoteAns(ans);
    },
    [setRemoteAns]
  );

  const getUserMediaStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    setMyStream(stream);
  }, []);

    const handleNegosiation = useCallback(() => {
      const localOffer = peer.localDescription;
      socket.emit("call-user", { emailId: remoteEmailId , offer: localOffer });
    },[peer,socket,remoteEmailId]);

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);

  useEffect(() => {
    peer.addEventListener("negosiationneeded", handleNegosiation);
    return () => {
      peer.removeEventListener("negosiationneeded", handleNegosiation);
    };
  }, [handleNegosiation, peer]);

  useEffect(() => {
    socket.on("user-joined", handleNewUserJoined);
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);
    return () => {
      socket.off("user-joined", handleNewUserJoined);
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
    };
  }, [socket, handleIncomingCall, handleNewUserJoined, handleCallAccepted]);

  return (
    <div>
      <h1>Room Page</h1>
      <h4>You are connected to {remoteEmailId}</h4>
      <button onClick={(e) => sendStream(myStream)}>Start Video</button>
      <ReactPlayer url={myStream} playing />
      <ReactPlayer url={remoteStream} playing />
    </div>
  );
};

export default Room;
