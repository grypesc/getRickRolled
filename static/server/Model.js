'use strict';

class Terrain {
  constructor(speedArg, typeArg, damageArg, isPassableArg) {
    this.speed = speedArg;
    this.type=typeArg;
    this.damage = damageArg;
    this.isPassable = isPassableArg;
  }
}


let sand = new Terrain (3, 'sand', 0, 1);
let edge = new Terrain (3, 'edge', 0, 0);
let grass = new Terrain (5, 'grass', 0, 1);
let water = new Terrain (1, 'water', 0, 1);
let lava = new Terrain (10, 'lava', 5, 1);
let brick = new Terrain (3, 'brick', 0, 0);
let floor = new Terrain (6, 'floor', 0, 1);

class Point {
  constructor(xArg, yArg) {
    this.x=xArg;
    this.y=yArg;
  }
}

class Map {
  constructor() {
    this.square = [];
    this.heightInSquares = 100;
    this.widthInSquares = 100;
    for (let i = 0; i < this.heightInSquares; i++) {
      this.square[i] = [];
      for (let j = 0; j < this.widthInSquares; j++) {
        if (i==0 || j==0 || i==99 || j==99)
        this.square[i][j]=edge;
        else
        this.square[i][j]=grass;

      }
    }
    this.createArea(new Point(1, 1), 50, 0.75, sand);
    this.createArea(new Point(10, 30), 200, 0.75, sand);
    this.createArea(new Point(97, 50), 1000, 0.65, sand);
    this.createArea(new Point(50, 20), 500, 0.65, sand);
    this.createArea(new Point(97, 97), 1000, 0.90, water);
    this.createArea(new Point(20, 30), 200, 0.75, water);
    this.createArea(new Point(20, 5), 100, 0.75, water);
    this.createArea(new Point(50, 50), 800, 0.60, water);
    this.createArea(new Point(50, 90), 800, 0.65, lava);
    this.createArea(new Point(2, 2), 30, 0.65, lava);
    this.createWall(50, 10, 4, "horizontally");
    this.createWall(80, 30, 4, "vertically");

    this.createBuilding(15,15,10, 10, 2);
    this.createBuilding(20,20,15, 20, 3);
    this.createBuilding(45,45,10,10, 18);
    this.createBuilding(60,10,30, 10, 9);
    this.createBuilding(20,80,40, 5, 7);
    this.createBridge(80,80,10);


  }


  createArea(center, size, randomness, type) { ///using a DFS algorithm
    let queue = [];
    queue.push(center);
    let currentSize=0;
    while (queue.length!=0 && currentSize<size)
    {
      let current=queue.shift();
      if (this.square[current.y][current.x] === type)
      continue;
      this.square[current.y][current.x]=type;
      currentSize++;

      if (Math.random()<=randomness && current.x+1 >=1 && current.x+1 <=98 && current.y >= 1 && current.y <=98 && this.square[current.x+1][current.y] !== type) {
        let currentNew = new Point(current.x+1, current.y);
        queue.push(currentNew);
      }
      if (Math.random()<=randomness && current.x >=1 && current.x <=98 && current.y+1 >= 1 && current.y+1 <=98 && this.square[current.x][current.y+1].type !== type) {
        let currentNew = new Point(current.x, current.y+1);
        queue.push(currentNew);
      }
      if (Math.random()<=randomness && current.x-1 >=1 && current.x-1 <=98 && current.y >= 1 && current.y <=98 && this.square[current.x-1][current.y].type !== type) {
        let currentNew = new Point(current.x-1, current.y);
        queue.push(currentNew);
      }
      if (Math.random()<=randomness && current.x >=1 && current.x <=98 && current.y-1 >= 1 && current.y-1 <=98 && this.square[current.x][current.y-1].type !== type) {
        let currentNew = new Point(current.x, current.y-1);
        queue.push(currentNew);
      }
    }
  }

  createBuilding(x, y, width, height, numberOfDoors ) {

    this.createWall(x,y,width,"horizontally");
    this.createWall(x,y+height-1,width,"horizontally");
    this.createWall(x,y,height,"vertically");
    this.createWall(x+width-1,y,height,"vertically");

    while(numberOfDoors--)
    {
      let doorsX, doorsY;
      switch (Math.floor(Math.random()*4)) {
        case 0://east
          doorsX = x+width-1;
          doorsY = y+Math.floor(Math.random()*(height-4))+1;
          this.square[doorsY][doorsX] = floor;
          this.square[doorsY+1][doorsX] = floor;
          break;

        case 1://north
          doorsX = x+Math.floor(Math.random()*(width-4))+1;
          doorsY = y;
          this.square[doorsY][doorsX] = floor;
          this.square[doorsY][doorsX+1] = floor;

          break;

        case 2://west
          doorsX = x;
          doorsY = y+Math.floor(Math.random()*(height-4))+1;
          this.square[doorsY][doorsX] = floor;
          this.square[doorsY+1][doorsX] = floor;
          break;

        case 3://south
          doorsX = x+Math.floor(Math.random()*(width-4))+1;
          doorsY = y+height-1;
          this.square[doorsY][doorsX] = floor;
          this.square[doorsY][doorsX+1] = floor;
          break;
      }

    }//numberOfDoors is changed now

    for (let i=1;i<height-1;i++) {
      for (let j=1;j<width-1;j++) {
        this.square[y+i][x+j] = floor;
      }
    }
  }

  createBridge(x, y, size) {
    this.createWall(x,y,size,"vertically");
    this.createWall(x+size-1,y,size,"vertically");
    for (let i=1;i<size-1;i++) {
      for (let j=1;j<size-1;j++) {
        this.square[x+i][y+j] = floor;
      }
    }
  }

  createWall(x,y,length, direction) {
    for (let i=0; i<length; i++)
    {
      if(this.square[y][x+i] != floor && direction == 'horizontally') {
        this.square[y][x+i] = brick;
        continue;
      }
      if(this.square[y+i][x] != floor && direction == 'vertically') {
        this.square[y+i][x] = brick;
      }
    }
  }
}

class Player {
  constructor(xArg, yArg, healthArg, directionArg, nameArg) {
    this.x = xArg;
    this.y = yArg;
    this.health = healthArg;
    this.direction = directionArg;
    this.name = nameArg;
    this.weapon = new Pistol();
    this.score = 0;
    this.killedBy = "notAPlayer";
  }

  pickUpItem(item, items) {
    if (!(this.weapon instanceof Pistol))
      this.dropItem(items);
    this.weapon = item;
  }

  dropItem(items){

    let dirX = -1;
    if(Math.random()>0.5)
      dirX = 1;
    let dirY = -1;
    if(Math.random()>0.5)
      dirY = 1;
    this.weapon.x=this.x + 100*dirX;
    this.weapon.y=this.y + 100*dirY;
    if (!(this.weapon instanceof Pistol))
      items.push(this.weapon);
  }

}

class Bullet {
  constructor(xArg, yArg, directionArg, damageArg, ownerArg) {
    this.x = xArg;
    this.y = yArg;
    this.direction = directionArg;
    this.speed = 20;
    this.range = 800;
    this.distanceTraveled = 0;
    this.damage = damageArg;
    this.owner = ownerArg;
  };

}

class BulletPhysics {
  constructor () {
    this.bullets = [];
  }

  update(map) {
    for (let i=0; i<this.bullets.length; i++){
      this.bullets[i].x += this.bullets[i].speed * Math.cos(this.bullets[i].direction);
      this.bullets[i].y += this.bullets[i].speed * Math.sin(this.bullets[i].direction);
      this.bullets[i].distanceTraveled += this.bullets[i].speed;
      if(!map.square[Math.floor((this.bullets[i].y)/50)][Math.floor((this.bullets[i].x)/50)].isPassable) {
        this.bullets.splice(i,1);
        i--;
      }
    }
  }

  checkRange() {
    let length = this.bullets.length;
    for (let i=0; i<length; i++) {
      if (this.bullets[i].distanceTraveled>=this.bullets[i].range) {
        this.bullets.splice(i,1);
        length--;
        i--;
      }

    }
  }

  checkHits(players) {
    for (let id in players)
    {
      let player=players[id];
      for (let i=0; i<this.bullets.length; i++) {
        if (this.bullets[i].x>=player.x-20 && this.bullets[i].x<=player.x+20 && this.bullets[i].y>=player.y-20 && this.bullets[i].y<=player.y+20) {
          player.health -= this.bullets[i].damage;
          if (player.health<=0)
            player.killedBy = this.bullets[i].owner;
          this.bullets.splice(i,1);
          i--;
        }
      }
    }
  }
}

class Item {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Items {
  constructor(mapSquares) {
    this.array = [];
    this.generateItems(100, mapSquares);
  };

  checkColissions(players) {
    for (let id in players)
    {
      let player=players[id];
      for (let i=0; i<this.array.length; i++) {
        if (  this.array[i].x>=player.x-this.array[i].spriteWidth && this.array[i].x<=player.x+this.array[i].spriteWidth && this.array[i].y>=player.y-this.array[i].spriteHeight && this.array[i].y<=player.y+this.array[i].spriteHeight) {
          if (this.array[i] instanceof Weapon)
            player.pickUpItem(this.array[i], this.array);
          else
            this.array[i].heal(player);
          this.array.splice(i,1);
          i--;
        }
      }
    }
  };

  generateItems(amount, mapSquares) {
    for (let i=0; i<amount; i++)
    {
      let item = new Item();
      switch( Math.floor(Math.random()*6) ) {

        case 0:
        item = new DoublePistol();
        break;

        case 1:
        item = new Rifle();
        break;

        case 2:
        item = new Revolver();
        break;

        case 3:
        item = new Smg();
        break;

        case 4:
        item = new Gatling();
        break;

        case 5:
        item = new HealthPack();
        break;

      }
      let newX, newY;
    do {
         newX = Math.random()*5000;
         newY = Math.random()*5000;
      }   while (!mapSquares[Math.floor(newX/50)][Math.floor(newY/50)].isPassable );

      item.x=newX;
      item.y=newY;

      this.array.push(item);
    }
  }
}

class HealthPack extends Item {
  constructor () {
    super();
    this.healthGain = 500;
    this.spriteName = "healthPack.png";
    this.spriteWidth = 50;
    this.spriteHeight = 50;
  }

  heal(player) {
    player.health+=this.healthGain;
  }

}

class Weapon extends Item {
  constructor(dmg, acc, fRate) {
    super();
    this.damage = dmg;
    this.accuracy = acc;
    this.spriteName = "null";
    this.triggered = 0;
    this.lastShot = new Date();
    this.fireRate = fRate; // in miliseconds
  };

  setBulletStats(bullet) {
    bullet.damage = this.damage;
  }
}

class AutomaticWeapon extends Weapon {
  constructor(dmg, acc, fireRate) {
    super(dmg, acc, fireRate);
  };

  shoot (x, y, direction, bulletPhysics, shooter)
  {
    let time = new Date();
    if (time - this.lastShot >= this.fireRate) {
      this.lastShot = time;
      let spread = (Math.random() - 0.5)*Math.PI*(100-this.accuracy)/100;
      let bullet = new Bullet(x+30*Math.cos(direction), y+30*Math.sin(direction), direction+spread, this.damage, shooter);
      this.setBulletStats(bullet);
      bulletPhysics.bullets.push(bullet);
    }
  }
}

class SemiAutomaticWeapon extends Weapon {
  constructor(dmg, acc, fireRate) {
    super(dmg, acc, fireRate);
  };

  shoot (x, y, direction, bulletPhysics, shooter)
  {
    let time = new Date();
    if(!this.triggered && time - this.lastShot >= this.fireRate) {
      this.lastShot = time;
      let spread = (Math.random() - 0.5)*Math.PI*(100-this.accuracy)/100;
      let bullet = new Bullet(x +30*Math.cos(direction), y+30*Math.sin(direction), direction+spread, this.damage, shooter);
      this.setBulletStats(bullet);
      bulletPhysics.bullets.push(bullet);
      this.triggered = 1;
    }
  }
}

class Pistol extends SemiAutomaticWeapon {
  constructor() {
    super(300, 95, 400);
    this.spriteName = "pistol.png";
    this.spriteWidth = 30;
    this.spriteHeight = 18;
  }
}

class Revolver extends SemiAutomaticWeapon {
  constructor() {
    super(600, 100, 500);
    this.spriteName = "revolver.png";
    this.spriteWidth = 30;
    this.spriteHeight = 18;
  }
}

class DoublePistol extends SemiAutomaticWeapon {
  constructor() {
    super(300, 95, 400);
    this.spriteName = "doublePistols.png";
    this.spriteWidth = 30;
    this.spriteHeight = 48;
  }

  shoot (x, y, direction, bulletPhysics)
  {
    let time = new Date();
    if(!this.triggered && time - this.lastShot >= this.fireRate) {
      this.lastShot = time;
      let spread1 = (Math.random() - 0.5)*Math.PI*(100-this.accuracy)/100;
      let bullet1 = new Bullet(x + 20*Math.cos(direction+Math.PI/2) + 50*Math.cos(direction), y + 20*Math.sin(direction+Math.PI/2) + 50*Math.sin(direction), direction+spread1, this.damage);
      this.setBulletStats(bullet1);
      bulletPhysics.bullets.push(bullet1);
      let spread2 = (Math.random() - 0.5)*Math.PI*(100-this.accuracy)/100;
      let bullet2 = new Bullet(x - 20*Math.cos(direction+Math.PI/2) + 50*Math.cos(direction), y - 20*Math.sin(direction+Math.PI/2) + 50*Math.sin(direction), direction+spread2, this.damage);
      this.setBulletStats(bullet2);
      bulletPhysics.bullets.push(bullet2);
      this.triggered = 1;
    }
  }
}

class Rifle extends AutomaticWeapon {
  constructor() {
    super(400, 98, 150);
    this.spriteName = "rifle.png";
    this.spriteWidth = 90;
    this.spriteHeight = 33;
  }

}

class Smg extends AutomaticWeapon {
  constructor() {
    super(100, 80, 50);
    this.spriteName = "smg.png";
    this.spriteWidth = 80;
    this.spriteHeight = 65;
  }
}

class Gatling extends AutomaticWeapon {
  constructor() {
    super(300, 70, 15);
    this.spriteName = "gatling.png";
    this.spriteWidth = 90;
    this.spriteHeight = 33;
  }
}

class Entry {
  constructor(name, socketId, score) {
    this.name = name;
    this.socketId = socketId;
    this.score = score;
  }
}

class Leaderboard {
  constructor() {
    this.array = [];
  }

  addEntry(name, socketId, score) {
    this.array.push(new Entry(name, socketId, score));
    this.sort();
  }

  addPoint(socketId) {
    for (let i=0; i<=this.array.length; i++ ) {
      if (this.array[i].socketId == socketId) {
      console.log("added");
        this.array[i].score++;
        break;
      }
    }
    this.sort();
  }

  sort() {
    this.array.sort(function(a, b) {
      return a.score < b.score;
    });
  }
}

class Model {
  constructor() {
    this.map = new Map();
    this.items = new Items(this.map.square);
    this.leaderboard = new Leaderboard();
  };

  getLeaderboard() {
    return this.leaderboard;
  }

  getMap() {
    return this.map;
  }
  getItems() {
    return this.items;
  }


  getNewPlayer(xArg, yArg, healthArg, directionArg, nameArg) {
    return new Player(xArg, yArg, healthArg, directionArg, nameArg);
  }

  getBulletPhysics(){
    return new BulletPhysics();
  }

  getBullet(xArg, yArg, directionArg){
    return new Bullet(xArg, yArg, directionArg);
  }

}


module.exports = Model;
