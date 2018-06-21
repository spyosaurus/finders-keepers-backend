import randomString from 'randomstring';
import Room from './room';

export default (ioServer) => {
  ioServer.on('connection', (socket) => {
    console.log('__CONNECTION__', socket.id);

    socket.on('SEND_MESSAGE', (data) => {
      console.log('__SOCKET_EVENT__', 'SEND_MESSAGE');

      ioServer.sockets.emit('RECEIVE_MESSAGE', data);
    });

    // creating rooms

    socket.on('CREATE_ROOM', () => {
      let roomCode = randomString.generate({
        charset: 'alphabetic',
        length: 4,
      }).toUpperCase();

      while (ioServer.rooms[roomCode]) {
        roomCode = randomString.generate({
          charset: 'alphabetic',
          length: 4,
        }).toUpperCase(); 
      }

      console.log('ROOM CREATED', roomCode);
      ioServer.rooms[roomCode] = new Room(socket, roomCode);
      const room = ioServer.rooms[roomCode];

      socket.join(roomCode);

      room.players.push(socket);
      const numPlayers = room.players.length;

      if (numPlayers >= 4) room.closed = true;

      socket.emit('JOINED_ROOM');
      ioServer.to(roomCode).emit('TRACK_PLAYERS', numPlayers);

      const data = { roomCode, roomHost: socket.id };
      socket.emit('SEND_ROOM', JSON.stringify(data));
    });

    // joining rooms

    socket.on('JOIN_ROOM', (roomCode, nickname) => {
      const room = ioServer.rooms[roomCode];
      if (room) {
        if (room.closed) {
          socket.emit('JOIN_ROOM_ERROR', 'room closed');
          return;
        }  
        console.log(`${nickname} joined ${roomCode}`);

        socket.join(roomCode);

        room.players.push(socket);
        const numPlayers = room.players.length;

        if (numPlayers >= 4) room.closed = true;

        socket.emit('JOINED_ROOM');
        ioServer.to(roomCode).emit('TRACK_PLAYERS', numPlayers);
      } else {
        socket.emit('JOIN_ROOM_ERROR', 'room does not exist');
      }
    });
    // redirect to game

    socket.on('HOST_REDIRECT', (roomCode) => {
      ioServer.to(roomCode).emit('REDIRECT');
    });

    // TODO: game socket helpers
  });
  ioServer.on('disconnect', (socket) => {
    console.log('__DISCONNECTION__', socket.id);
  });
};
