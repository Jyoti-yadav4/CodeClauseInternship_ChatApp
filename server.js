const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('🟢 User connected');

  socket.on('joinRoom', ({ room, username }) => {
    socket.join(room);
    socket.room = room;
    socket.username = username;

    socket.to(room).emit('message', {
      username: '📢 System',
      time: new Date().toLocaleTimeString(),
      msg: `${username} joined the room.`
    });
  });

  socket.on('chatMessage', ({ msg, time, username }) => {
    io.to(socket.room).emit('message', {
      username,
      time,
      msg
    });
  });

  socket.on('disconnect', () => {
    if (socket.room && socket.username) {
      socket.to(socket.room).emit('message', {
        username: '📢 System',
        time: new Date().toLocaleTimeString(),
        msg: `${socket.username} left the room.`
      });
    }
  });
});

const PORT = 3002;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
