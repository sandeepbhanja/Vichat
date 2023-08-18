import express from "express";
import {Server} from 'socket.io';
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());
const io = new Server({
    cors:true,
});

const emailToroomMapping = new Map();
const socketToEmailMapping = new Map();

io.on('connection', (socket)=>{
    socket.on('join-room', (data)=>{
        const{roomId , emailId} = data;  
        console.log(roomId, emailId);
        emailToroomMapping.set(emailId,socket.id);
        socketToEmailMapping.set(socket.id,emailId);
        socket.join(roomId);
        socket.emit("joined-room",{roomId});
        socket.broadcast.to(roomId).emit('user-joined',{emailId});
    });
    socket.on('call-user', (data)=>{
        const {emailId,offer} = data;
        const fromEmail = socketToEmailMapping.get(socket.id);
        const socketId = emailToroomMapping.get(emailId);
        socket.to(socketId).emit('incoming-call',{from: fromEmail , offer});
    });

    socket.on('call-accept', (data)=>{
        const {emailId,ans}=data;
        // console.log(data);
        const socketId = emailToroomMapping.get(emailId);
        socket.to(socketId).emit('call-accepted',{ans});
    })
})

app.listen(5000,()=>{
    console.log('listening on port 3000');
})
io.listen(5001);