'use strict';
class Controller {
    constructor() {
      this.squareWidthInPixels = 50;
      this.squareHeightInPixels = 50;
      this.width = 1000;         // default: 800
      this.height = 800;
      this.playerSpriteWidth = 50;
      this.playerSpriteHeight = 50;
      this.mode = 'alive';
      this.padding = 50;
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
    socket.on('update', function(newPlayers, newcurrentPlayer, newAbsoluteCurrentPlayer, currentPlayerMap, bulletsArg, itemsArg) {
      players = newPlayers;
      currentPlayer=newcurrentPlayer;
      currentPlayer.xAbsolute=newAbsoluteCurrentPlayer.x;
      currentPlayer.yAbsolute=newAbsoluteCurrentPlayer.y;
      bullets=bulletsArg;
      items = itemsArg;

      for (var i = 0; i < 17; i++) {
        for (var j = 0; j < 21; j++) {
          gameMap.square[i][j].path = 'static/client/sprites/'+currentPlayerMap[i][j]+'.png';
          }
        }
      }

    );
  }

  listenToDeath() {
    socket.on('death', function() {
      setTimeout(function(){ controller.mode = "dead"; }, 1000);
      setTimeout(function(){ if (window.confirm("Ooops, you were owned. Don't you want to cancel not being not owned again?"))
                           { window.location.href='http://widit.knu.ac.kr/~rypesc/';
                           }
                             else
                             {
                               window.location.href='https://www.youtube.com/watch?v=dQw4w9WgXcQ';
                             }; }, 1500);
    }

    );
  }
}


class GameMap  {
  constructor() {
    this.square = [];
    this.heightInSquares = 17;
    this.widthInSquares = 21;

    for (let i = 0; i < this.heightInSquares; i++) {
      this.square[i] = [];
      for (let j = 0; j < this.widthInSquares; j++) {
        this.square[i][j]=new Terrain('static/client/sprites/grass.png');
      }
    }
  }

}

class Player {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.health = 100;
    this.direction = Math.PI;
    this.name = 'null';
  }
}

class CurrentPlayer extends Player {
  constructor() {
    super ();
    this.xAbsolute = 0;
    this.yAbsolute = 0;
  }
}

class Bullet {
  constructor(xArg, yArg, directionArg) {
    this.x = xArg;
    this.y = yArg;
    this.direction = directionArg;
    this.speed = 15;
    this.range = 100;
    this.distanceTraveled = 0;
  };
}
