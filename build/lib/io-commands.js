'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _randomstring = require('randomstring');

var _randomstring2 = _interopRequireDefault(_randomstring);

var _room = require('./room');

var _room2 = _interopRequireDefault(_room);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (ioServer) {
  ioServer.on('connection', function (socket) {
    console.log('__CONNECTION__', socket.id);

    socket.on('SEND_MESSAGE', function (data) {
      console.log('__SOCKET_EVENT__', 'SEND_MESSAGE');

      ioServer.sockets.emit('RECEIVE_MESSAGE', data);
    });

    // creating rooms

    socket.on('CREATE_ROOM', function (username) {
      var roomCode = _randomstring2.default.generate({
        charset: 'alphabetic',
        length: 4
      }).toUpperCase();

      while (ioServer.rooms[roomCode]) {
        roomCode = _randomstring2.default.generate({
          charset: 'alphabetic',
          length: 4
        }).toUpperCase();
      }

      console.log('roomcode, username', roomCode, username);

      ioServer.rooms[roomCode] = new _room2.default(socket, roomCode);
      var room = ioServer.rooms[roomCode];
      socket.join(roomCode);

      room.playerNames.push(username);
      var listPlayers = room.playerNames;

      room.playerSockets.push(socket);
      var numPlayers = room.playerSockets.length;

      if (numPlayers >= 12) room.closed = true;

      socket.emit('JOINED_ROOM');
      ioServer.to(roomCode).emit('TRACK_PLAYERS', numPlayers, listPlayers);

      var data = { roomCode: roomCode, roomHost: socket.id };
      socket.emit('SEND_ROOM', JSON.stringify(data));
    });

    // joining rooms

    socket.on('JOIN_ROOM', function (roomCode, username) {
      var room = ioServer.rooms[roomCode];
      if (room) {
        if (room.closed) {
          socket.emit('JOIN_ROOM_ERROR', 'room closed');
          return;
        }
        console.log(username + ' joined ' + roomCode);
        socket.join(roomCode);

        room.playerNames.push(username);
        var listPlayers = room.playerNames;

        room.playerSockets.push(socket);
        var numPlayers = room.playerSockets.length;

        if (numPlayers >= 12) room.closed = true;

        socket.emit('JOINED_ROOM');
        ioServer.to(roomCode).emit('TRACK_PLAYERS', numPlayers, listPlayers);
      } else {
        socket.emit('JOIN_ROOM_ERROR', 'room does not exist');
      }
    });
    // redirects

    socket.on('HOST_REDIRECT', function (roomCode) {
      ioServer.to(roomCode).emit('REDIRECT');
    });

    // host var socket helpers

    socket.on('SET_HOSTVARS', function (roomCode, numStars, time, backgroundImageNumber) {
      var room = ioServer.rooms[roomCode];
      console.log('HOSTVARS', numStars, time, backgroundImageNumber);
      var data = { numStars: numStars, time: time, backgroundImageNumber: backgroundImageNumber };
      ioServer.to(roomCode).emit('GET_HOSTVARS', JSON.stringify(data));
    });

    // game socket helpers

    socket.on('TIME_OVER', function (roomCode, score, username) {
      console.log('time over vars', roomCode, score, username);
      var room = ioServer.rooms[roomCode];
      room.playerScores[username] = score;
    });

    socket.on('UPDATE_SCORES', function (roomCode) {
      var room = ioServer.rooms[roomCode];
      ioServer.to(roomCode).emit('SCORES_UPDATED', room.playerScores);
    });
  });
  ioServer.on('disconnect', function (socket) {
    console.log('__DISCONNECTION__', socket.id);
  });
};
