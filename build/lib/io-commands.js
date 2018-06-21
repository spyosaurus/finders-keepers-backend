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

    socket.on('CREATE_ROOM', function () {
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

      console.log('ROOM CREATED', roomCode);
      ioServer.rooms[roomCode] = new _room2.default(socket, roomCode);
      var room = ioServer.rooms[roomCode];

      socket.join(roomCode);

      room.players.push(socket);
      var numPlayers = room.players.length;

      if (numPlayers >= 4) room.closed = true;

      socket.emit('JOINED_ROOM');
      ioServer.to(roomCode).emit('TRACK_PLAYERS', numPlayers);

      var data = { roomCode: roomCode, roomHost: socket.id };
      socket.emit('SEND_ROOM', JSON.stringify(data));
    });

    // joining rooms

    socket.on('JOIN_ROOM', function (roomCode, nickname) {
      var room = ioServer.rooms[roomCode];
      if (room) {
        if (room.closed) {
          socket.emit('JOIN_ROOM_ERROR', 'room closed');
          return;
        }
        console.log(nickname + ' joined ' + roomCode);

        socket.join(roomCode);

        room.players.push(socket);
        var numPlayers = room.players.length;

        if (numPlayers >= 4) room.closed = true;

        socket.emit('JOINED_ROOM');
        ioServer.to(roomCode).emit('TRACK_PLAYERS', numPlayers);
      } else {
        socket.emit('JOIN_ROOM_ERROR', 'room does not exist');
      }
    });
    // redirect to game

    socket.on('HOST_REDIRECT', function (roomCode) {
      ioServer.to(roomCode).emit('REDIRECT');
    });

    // TODO: game socket helpers
  });
  ioServer.on('disconnect', function (socket) {
    console.log('__DISCONNECTION__', socket.id);
  });
};