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
let water = new Terrain (1, 'water');

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
      this.createArea(new Point(1, 1), 50, 0.75, sand);
      this.createArea(new Point(10, 30), 200, 0.75, sand);
      this.createArea(new Point(20, 30), 200, 0.75, water);
      this.createArea(new Point(20, 5), 100, 0.75, water);
      this.createArea(new Point(50, 50), 800, 0.60, water);
      }


  createArea(center, size, randomness, type) { ///using a DFS algorithm
    let queue = [];
    queue.push(center);
    let currentSize=0;
    while (queue.length!=0 && currentSize<size)
    {
      let current=queue.shift();
      if (this.square[current.x][current.y] === type)
        continue;
      this.square[current.x][current.y]=type;
      currentSize++;

      if (Math.random()<=randomness && current.x+1 >=1 && current.x+1 <=99 && current.y >= 1 && current.y <=99 && this.square[current.x+1][current.y] !== type) {
        let currentNew = new Point(current.x+1, current.y);
        queue.push(currentNew);
      }
      if (Math.random()<=randomness && current.x >=1 && current.x <=99 && current.y+1 >= 1 && current.y+1 <=99 && this.square[current.x][current.y+1].type !== type) {
        let currentNew = new Point(current.x, current.y+1);
        queue.push(currentNew);
      }
      if (Math.random()<=randomness && current.x-1 >=1 && current.x-1 <=99 && current.y >= 1 && current.y <=99 && this.square[current.x-1][current.y].type !== type) {
        let currentNew = new Point(current.x-1, current.y);
        queue.push(currentNew);
      }
      if (Math.random()<=randomness && current.x >=1 && current.x <=99 && current.y-1 >= 1 && current.y-1 <=99 && this.square[current.x][current.y-1].type !== type) {
        let currentNew = new Point(current.x, current.y-1);
        queue.push(currentNew);
      }
    }
  }
}

class Point {
  constructor(xArg, yArg) {
    this.x=xArg;
    this.y=yArg;
  }
}

class Player {
  constructor(xArg, yArg, healthArg, directionArg) {
    this.x = xArg;
    this.y = yArg;
    this.health = healthArg;
    this.direction = directionArg;
  }
}

class Model {
  constructor() {
    this.map = new Map();
  };

  getMap() {
    return this.map;
  }

  getNewPlayer(xArg, yArg, healthArg, directionArg) {
    return new Player(xArg, yArg, healthArg, directionArg);
  }

}


module.exports = Model;
