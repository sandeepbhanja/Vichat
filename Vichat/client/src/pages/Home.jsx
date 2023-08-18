import React ,{useState,useEffect, useCallback} from 'react'
import {Form,Button} from 'react-bootstrap';
import { useSocket } from "../providers/SocketContext";
import {useNavigate} from 'react-router-dom';
const Home = () => {
  const {socket} = useSocket();
  const navigate = useNavigate();
  const [emailId,setEmailId] = useState("");
  const [roomId,setroomId] = useState("");
  
  const handleJoinRoom = ()=>{
    socket.emit("join-room", {roomId,emailId});
  }

  const handleRoomJoined = useCallback(({roomId})=>{
    navigate(`/room/${roomId}`);
  },[navigate]);

  useEffect(()=>{
    socket.on("joined-room",handleRoomJoined);
    return ()=>{
      socket.off('joined-room',handleRoomJoined);
    }
  },[socket,handleRoomJoined]);

  return (
    <div
      style={{ width: "18rem", top: "30%", left: "42%", position: "absolute" }}
      className="mx-auto"
    >
      <div>
        <Form>
          <Form.Group>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              onChange={(e) => setEmailId(e.target.value)}
              value={emailId}
            ></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Room ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Room ID"
              onChange={(e) => setroomId(e.target.value)}
              value={roomId}
            ></Form.Control>
          </Form.Group>
          <Button className="btn btn-dark my-2" onClick={handleJoinRoom}>Enter</Button>
        </Form>
      </div>
    </div>
  );
}

export default Home
