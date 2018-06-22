module.exports = class Room {
  constructor(socket, roomCode) {
    this.host = socket;
    this.code = roomCode;
    this.playerSockets = [];
    this.playerNames = [];
    this.playerScores = {};
    this.closed = false;

    socket.join(roomCode);
  }

  startGame() {
    this.closed = true;
  }
};
