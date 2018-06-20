module.exports = class Room {
  constructor(socket, roomCode) {
    this.host = socket;
    this.code = roomCode;
    this.players = [];
    this.closed = false;

    socket.join(roomCode);
  }

  startGame() {
    this.closed = true;
  }
};
