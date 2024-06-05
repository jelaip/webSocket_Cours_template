import express from 'express';
import http from 'http';
import ip from 'ip';
import { Server } from 'socket.io';
import cors from 'cors';
const app = express();
const server = http.createServer(app);
const PORT = 3000;
const io = new Server(server, {
    cors: {
        origin: '*',
        }
})

let SaveDataRoom = [];  

app.use(cors())
app.get('/', (req, res) => {
    res.json('ip address: http://' + ip.address()+':'+PORT);    
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.broadcast.emit('user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.broadcast.emit('user disconnected');
    });
    socket.on('message', (msg) => {
        console.log('message: ' + msg);
        io.emit('message', msg);
    });
    
    socket.on('room', (room, user, msg) => {
        console.log('room: ' + room + ' message: ' + msg + ' user: ' + user);
        if (SaveDataRoom[room] === undefined) {
            SaveDataRoom[room] = [];
        }
        SaveDataRoom[room].push(user + ' : ' + msg);
        io.to(room).emit('message', msg,user);
    });

    socket.on('join', (room, nameUser) => {
        console.log('join room: ' + room + ' name: ' + nameUser);
        socket.join(room);
        if (SaveDataRoom[room] === undefined) {
            SaveDataRoom[room] = [];
        }
        SaveDataRoom[room].push(nameUser + ' join ' + room);
        socket.emit('getHistory', SaveDataRoom[room]);
        //io.to(room).emit('join', room, nameUser);
        socket.to(room).emit('joinUser', room, nameUser);
    });
    socket.on('leave', (room, user) => {
        console.log('leave room: ' + room+  ' user: ' + user);
        if (SaveDataRoom[room] === undefined) {
            SaveDataRoom[room] = [];
        }
        SaveDataRoom[room].push(user + ' leave ' + room);
        socket.leave(room);
        io.to(room).emit('leaveUser', room, user);
    });
})


server.listen(PORT, () => {
    console.log('Server ip : http://' +ip.address() +":" + PORT);
})

