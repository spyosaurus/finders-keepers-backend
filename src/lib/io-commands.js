import randomString from 'randomstring';
import Room from './room';

export default (ioServer) => {
  ioServer.on('connection', (socket) => {
    socket.on('SEND_MESSAGE', (data) => {
      ioServer.sockets.emit('RECEIVE_MESSAGE', data);
    });

    // creating rooms

    socket.on('CREATE_ROOM', (username) => {
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

      ioServer.rooms[roomCode] = new Room(socket, roomCode);
      const room = ioServer.rooms[roomCode];
      socket.join(roomCode);

      room.playerNames.push(username);
      const listPlayers = room.playerNames;

      room.playerSockets.push(socket);
      const numPlayers = room.playerSockets.length;

      if (numPlayers >= 12) room.closed = true;

      socket.emit('JOINED_ROOM');
      ioServer.to(roomCode).emit('TRACK_PLAYERS', numPlayers, listPlayers);

      const data = { roomCode, roomHost: socket.id };
      socket.emit('SEND_ROOM', JSON.stringify(data));
    });

    // joining rooms

    socket.on('JOIN_ROOM', (roomCode, username) => {
      const room = ioServer.rooms[roomCode];
      if (room) {
        if (room.closed) {
          socket.emit('JOIN_ROOM_ERROR', 'room closed');
          return;
        }
        socket.join(roomCode);

        room.playerNames.push(username);
        const listPlayers = room.playerNames;

        room.playerSockets.push(socket);
        const numPlayers = room.playerSockets.length;

        if (numPlayers >= 12) room.closed = true;

        socket.emit('JOINED_ROOM');
        ioServer.to(roomCode).emit('TRACK_PLAYERS', numPlayers, listPlayers);
      } else {
        socket.emit('JOIN_ROOM_ERROR', 'room does not exist');
      }
    });
    // redirects

    socket.on('HOST_REDIRECT', (roomCode) => {
      ioServer.to(roomCode).emit('REDIRECT');
    });

    // host var socket helpers

    socket.on('SET_HOSTVARS', (roomCode, numStars, time, backgroundImageNumber) => {
      const room = ioServer.rooms[roomCode]; // eslint-disable-line
      const data = { numStars, time, backgroundImageNumber };
      ioServer.to(roomCode).emit('GET_HOSTVARS', JSON.stringify(data));
    }); 

    // game socket helpers

    socket.on('TIME_OVER', (roomCode, score, username) => {
      const room = ioServer.rooms[roomCode];
      room.playerScores[username] = score;
    });

    socket.on('UPDATE_SCORES', (roomCode) => {
      const room = ioServer.rooms[roomCode];
      ioServer.to(roomCode).emit('SCORES_UPDATED', room.playerScores);
    });
  });
};
