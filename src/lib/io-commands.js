import uuid from 'uuid';

const SEND_MESSAGE = 'SEND_MESSAGE';
const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';
const players = [];

export default (ioServer) => {
  ioServer.on('connection', (socket) => {
    console.log('__CONNECTION__', socket.id);

    socket.on(SEND_MESSAGE, (data) => {
      console.log('__SOCKET_EVENT__', SEND_MESSAGE);

      ioServer.sockets.emit(RECEIVE_MESSAGE, data);
    });
  });
  ioServer.on('disconnect', (socket) => {
    console.log('__DISCONNECTION__', socket.id);
  });
};
