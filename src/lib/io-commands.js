import uuid from 'uuid';

const SEND_MESSAGE = 'SEND_MESSAGE';
const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';

export default (ioServer) => {
  ioServer.on('connection', (socket) => {
    console.log('__CONNECTION__', socket.id);

    socket.on(SEND_MESSAGE, (data) => {
      console.log('__SOCKET_EVENT__', SEND_MESSAGE);
      socket.emit(RECEIVE_MESSAGE, 'You have sent a message.');
      ioServer.emit(RECEIVE_MESSAGE, {
        ...data,
        id: uuid(),
        timestamp: new Date(),
      });
    });
  });
};
