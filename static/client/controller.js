'use strict';
class Controller {
    constructor() {
      this.squareWidthInPixels = 50;
      this.squareHeightInPixels = 50;
      this.width = 1000;         // default: 800
      this.height = 800;
      this.playerSpriteWidth = 50;
      this.playerSpriteHeight = 50;
  }

  newPlayer() {
    socket.emit('new player');
  }

  emitInput() {
    setInterval(function() {
      socket.emit('input', input);
    }, 1000 / 60);
  }


  listenToUpdate() {
    socket.on('update', function(newPlayers, newcurrentPlayer, newAbsoluteCurrentPlayer, currentPlayerMap) {
      players = newPlayers;
      currentPlayer=newcurrentPlayer;
      currentPlayer.xAbsolute=newAbsoluteCurrentPlayer.x;
      currentPlayer.yAbsolute=newAbsoluteCurrentPlayer.y;

      for (var i = 0; i < 21; i++) {
        for (var j = 0; j < 21; j++) {
          gameMap.square[i][j].path = 'static/res/'+currentPlayerMap[i][j]+'.png';
        }
      }
    }

  );
}
}


class GameMap  {
  constructor() {
    this.square = [];
    this.heightInSquares = 21;
    this.widthInSquares = 21;

    for (let i = 0; i < this.heightInSquares; i++) {
      this.square[i] = [];
      for (let j = 0; j < this.widthInSquares; j++) {
        this.square[i][j]=new Terrain('static/res/grass.png');
      }
    }
  }

}

class Player {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.health = 0;
    this.direction = Math.PI;
  }
}

class CurrentPlayer extends Player {
  constructor() {
    super ();
    this.xAbsolute = 0;
    this.yAbsolute = 0;
  }
}
