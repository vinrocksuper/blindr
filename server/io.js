const http = require('http');
const { Server } = require('socket.io');

let io;

/* This handleChatMessage function takes in a message and "emits" it
    to a specific channel in our socket.io system. Clients can choose to
    subscribe to specific channels, as seen in the /hosted/client.js file.
*/
const handleChatMessage = (msg, socket) => {
  const message = `${socket.request.session.account.username}: ${msg.message}`;
  io.emit(msg.channel, message);
};

/* This setup function takes in our express app, adds Socket.IO to it,
    and sets up event handlers for our io events.
*/
const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);
const socketSetup = (app, sessionMiddleware) => {
  const server = http.createServer(app);
  io = new Server(server);
  io.use(wrap(sessionMiddleware));
  io.on('connection', (socket) => {
    console.log(`${socket.request.session.account.username} connected`);

    socket.on('disconnect', () => {
      console.log(`${socket.request.session.account.username} disconnected`);
    });

    socket.on('chat message', (msg) => { handleChatMessage(msg, socket); });
  });

  return server;
};

// We only export the one function from this file, just like in router.js
module.exports = socketSetup;
