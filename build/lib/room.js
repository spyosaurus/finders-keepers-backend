"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
  function Room(socket, roomCode) {
    _classCallCheck(this, Room);

    this.host = socket;
    this.code = roomCode;
    this.playerSockets = [];
    this.playerNames = [];
    this.playerScores = {};
    this.closed = false;

    socket.join(roomCode);
  }

  _createClass(Room, [{
    key: "startGame",
    value: function startGame() {
      this.closed = true;
    }
  }]);

  return Room;
}();