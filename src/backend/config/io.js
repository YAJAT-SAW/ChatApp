const { Server } = require("socket.io");

const URL = 'https://chat-r311.onrender.com';
let ioInstance;

exports.ioCreate = (server) => {
  ioInstance = new Server(server, {
    cors: {
      origin: '*',
      methods: ["GET", "POST"],
      transports: ['websocket'],
    },
  });
  return ioInstance;
};

exports.getIo = () => {
  if (!ioInstance) {
    throw new Error("Socket.io not initialized!");
  }
  return ioInstance;
};
