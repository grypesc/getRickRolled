'use strict';

class Terrain {
  constructor(speedArg, typeArg) {
    this.speed = speedArg;
    this.type=typeArg;
  }
}

let sand = new Terrain (3, 'sand');
let edge = new Terrain (3, 'edge');
let grass = new Terrain (5, 'grass');

class Map {
  constructor() {
    this.square = [];
    this.heightInSquares = 100;
    this.widthInSquares = 100;
    for (var i = 0; i < this.heightInSquares; i++) {
      this.square[i] = [];
      for (var j = 0; j < this.widthInSquares; j++) {
        if (i==0 || j==0 || i==99 || j==99)
          this.square[i][j]=edge;
        else
          this.square[i][j]=grass;

      }
    }
    for (var i = 1; i < 10; i++)
      for (var j = 1; j <= i; j++)
          this.square[i][j]=sand;
  }
}


class Model {
  constructor() {
    this.map = new Map();
  };

  getMap() {
    return this.map;
  }
}



module.exports = Model;
