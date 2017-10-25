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

  // Disconnect
  connections.splice(connections.indexOf(socket), 1);
  console.log(`Disconnected: ${connections.length} sockets connected`);
});
