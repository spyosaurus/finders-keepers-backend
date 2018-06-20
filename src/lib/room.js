module.exports = class Room {
    constructor(socket, roomCode) {
        this.host = socket;
        this.code = roomCode;
        this.players = [];
        this.closed = false;

        socket.join(roomCode);
    }

    startGame(game, roomCode, socket, ioServer) {
        this.closed = true;
    }
}