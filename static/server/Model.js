  'use strict';

class Terrain {
  constructor(speedArg, typeArg, damageArg) {
    this.speed = speedArg;
    this.type=typeArg;
    this.damage = damageArg;
  }
}
let sand = new Terrain (3, 'sand', 0);
let edge = new Terrain (3, 'edge', 0);
let grass = new Terrain (5, 'grass', 0);
let water = new Terrain (1, 'water', 0);
let lava = new Terrain (10, 'lava', 5);



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
      this.createArea(new Point(97, 97), 1000, 0.90, water);
      this.createArea(new Point(20, 30), 200, 0.75, water);
      this.createArea(new Point(20, 5), 100, 0.75, water);
      this.createArea(new Point(50, 50), 800, 0.60, water);
      this.createArea(new Point(50, 90), 800, 0.60, lava);
      this.createArea(new Point(2, 2), 30, 0.60, lava);
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
}

class Building {
  constructor()
}

class Point {
  constructor(xArg, yArg) {
    this.x=xArg;
    this.y=yArg;
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
  }

}

class Bullet {
  constructor(xArg, yArg, directionArg, damageArg) {
    this.x = xArg;
    this.y = yArg;
    this.direction = directionArg;
    this.speed = 20;
    this.range = 1000;
    this.distanceTraveled = 0;
    this.damage = damageArg;
  };

}

class BulletPhysics {
  constructor () {
    this.bullets = [];
  }

  update() {
    for (let i=0; i<this.bullets.length; i++){
      this.bullets[i].x += this.bullets[i].speed * Math.cos(this.bullets[i].direction);
      this.bullets[i].y += this.bullets[i].speed * Math.sin(this.bullets[i].direction);
      this.bullets[i].distanceTraveled += this.bullets[i].speed;
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
          this.bullets.splice(i,1);
          i--;
        }
      }
    }
  }
}

class Items {
  constructor() {
    this.array = [];
    this.generateItems(100);
  };

  checkColissions(players) {
    for (let id in players)
    {
      let player=players[id];
      for (let i=0; i<this.array.length; i++) {
        if (  this.array[i].x>=player.x-this.array[i].spriteWidth && this.array[i].x<=player.x+this.array[i].spriteWidth && this.array[i].y>=player.y-this.array[i].spriteHeight && this.array[i].y<=player.y+this.array[i].spriteHeight) {
          if (this.array[i] instanceof Weapon)
            player.weapon = this.array[i];
          else
            this.array[i].heal(player);
          this.array.splice(i,1);
          i--;
        }
      }
    }
  };

  generateItems(amount) {
    for (let i=0; i<amount; i++)
    {
      let item = new Item();
      switch( Math.floor(Math.random()*5) ) {

           case 0:
           item = new DoublePistol();
           break;

           case 1:
           item = new Rifle();
           break;

           case 2:
           item = new Smg();
           break;

           case 3:
           item = new Gatling();
           break;

           case 4:
           item = new HealthPack();
           break;

       }
       item.x=Math.floor(Math.random()*5000);
       item.y=Math.floor(Math.random()*5000);
       this.array.push(item);
     }
  }
}

class Item {
  constructor(x = 100, y = 100) {
    this.x = x;
    this.y = y;
  }
}

class HealthPack extends Item {
  constructor () {
    super();
    this.healthGain = 500;
    this.spriteName = "healthPack.png";
    this.spriteWidth = 100;
    this.spriteHeight = 100;
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

  shoot (x, y, direction, bulletPhysics)
  {
    let time = new Date();
    if (time - this.lastShot >= this.fireRate) {
      this.lastShot = time;
      let spread = (Math.random() - 0.5)*Math.PI*(100-this.accuracy)/100;
      let bullet = new Bullet(x+50*Math.cos(direction), y+50*Math.sin(direction), direction+spread, this.damage);
      this.setBulletStats(bullet);
      bulletPhysics.bullets.push(bullet);
    }
  }
}

class SemiAutomaticWeapon extends Weapon {
  constructor(dmg, acc, fireRate) {
    super(dmg, acc, fireRate);
  };

  shoot (x, y, direction, bulletPhysics)
  {
    let time = new Date();
    if(!this.triggered && time - this.lastShot >= this.fireRate) {
      this.lastShot = time;
      let spread = (Math.random() - 0.5)*Math.PI*(100-this.accuracy)/100;
      let bullet = new Bullet(x +50*Math.cos(direction), y+50*Math.sin(direction), direction+spread, this.damage);
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
    this.spriteWidth = 109;
    this.spriteHeight = 40;
  }

}

class Smg extends AutomaticWeapon {
  constructor() {
    super(100, 80, 50);
    this.spriteName = "smg.png";
    this.spriteWidth = 80;
    this.spriteHeight = 80;
  }
}

class Gatling extends AutomaticWeapon {
  constructor() {
    super(300, 70, 20);
    this.spriteName = "gatling.png";
    this.spriteWidth = 80;
    this.spriteHeight = 80;
  }
}

class Model {
  constructor() {
    this.map = new Map();
    this.items = new Items();
  };

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
