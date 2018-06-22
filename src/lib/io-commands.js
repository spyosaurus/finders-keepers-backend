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

      console.log('roomcode, username', roomCode, username);

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
        console.log(`${username} joined ${roomCode}`);
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
      const room = ioServer.rooms[roomCode];
      console.log('HOSTVARS', numStars, time, backgroundImageNumber);
      const data = { numStars, time, backgroundImageNumber};
      ioServer.to(roomCode).emit('GET_HOSTVARS', JSON.stringify(data));
    }); 

    // game socket helpers

    socket.on('TIME_OVER', (roomCode, score, username) => {
      console.log('time over vars', roomCode, score, username)
      const room = ioServer.rooms[roomCode];
      room.playerScores[username] = score;
    })

    socket.on('UPDATE_SCORES', (roomCode) => {
      const room = ioServer.rooms[roomCode];
      ioServer.to(roomCode).emit('SCORES_UPDATED', room.playerScores);
    })

  });
  ioServer.on('disconnect', (socket) => {
    console.log('__DISCONNECTION__', socket.id);
  });
};
