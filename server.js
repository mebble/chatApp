const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

let users = [];
let connections = [];

server.listen(process.env.PORT || 3000);
console.log('Server running...');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

io.sockets.on('connection', (socket) => {
  connections.push(socket);
  console.log(`Connected: ${connections.length} sockets connected`);

  // client disconnects
  socket.on('disconnect', (data) => {
    connections.splice(connections.indexOf(socket), 1);
    console.log(`Disconnected: ${connections.length} sockets connected`);

    if (!socket.username) return;
    users.splice(users.indexOf(socket.username), 1);  // users.indexOf(undefined) == -1
    updateUsernames();
  });

  // message from client
  socket.on('send message', (data) => {
    io.sockets.emit('new message', { msg: data, username: socket.username });
  });

  // new client user data
  socket.on('new user', (data, callback) => {
    callback(true);
    socket.username = data;  // this socket connection gets the socket user's username
    users.push(socket.username);
    updateUsernames();
  });

  // let the clients know the updated users list
  function updateUsernames() {
    io.sockets.emit('get users', users);
  }
});
