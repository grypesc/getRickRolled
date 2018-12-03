'use strict';
let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
  type = "canvas"
}



let app = new PIXI.Application({
  width: controller.width,
  height: controller.height,
  antialias: true,
  transparent: false,
  resolution: 1
}
);


PIXI.loader
.add("static/client/sprites/grass.png")
.add("static/client/sprites/sand.png")
.add("static/client/sprites/edge.png")
.add("static/client/sprites/water.png")
.add("static/client/sprites/lava.png")
.add("static/client/sprites/brick.png")
.add("static/client/sprites/floor.png")

.add("static/client/sprites/player.png")
.add("static/client/sprites/pistol.png")
.add("static/client/sprites/revolver.png")
.add("static/client/sprites/doublePistols.png")
.add("static/client/sprites/rifle.png")
.add("static/client/sprites/smg.png")
.add("static/client/sprites/gatling.png")
.add("static/client/sprites/bullet.png")
.add("static/client/sprites/healthPack.png")
.add("static/client/sprites/dead.png")
.load(setup);
function setup() {
controller.newPlayer();
controller.emitInput();
controller.listenToUpdate();
controller.listenToDeath();
app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta){
app.stage.removeChildren();
if (controller.mode == 'dead')
{
  let deadSprite = new PIXI.Sprite(PIXI.loader.resources['static/client/sprites/dead.png'].texture);
  deadSprite.position.set(0,0);
  app.stage.addChild(deadSprite);
  return;
}

for (let i = 0; i < 17; i++) {
  for (let j = 0; j < 21; j++) {
    let square = new PIXI.Sprite(PIXI.loader.resources[gameMap.square[i][j].path].texture);
    square.x=controller.squareWidthInPixels*j-currentPlayer.xAbsolute%50;
    square.y=controller.squareHeightInPixels*i-currentPlayer.yAbsolute%50;
    app.stage.addChild(square);
  }
}
for (let id in players) {
  let player = players[id];
  let playerSprite = new PIXI.Sprite(PIXI.loader.resources['static/client/sprites/player.png'].texture);
  playerSprite.anchor.set(0.5,0.5);
  playerSprite.position.set(player.x,player.y);
  app.stage.addChild(playerSprite);

  let weaponSprite = new PIXI.Sprite(PIXI.loader.resources['static/client/sprites/'+player.weapon.spriteName].texture);
  weaponSprite.anchor.set(0.5,0.5);
  weaponSprite.rotation = player.direction;
  weaponSprite.x=player.x+10*Math.cos(player.direction);
  weaponSprite.y=player.y+10*Math.sin(player.direction);
  app.stage.addChild(weaponSprite);

  let name = new PIXI.Text(player.name);
  name.style = {fill: 'white', stroke: 'black', strokeThickness: 2};
  name.anchor.set(0.5,0.5);
  name.position.set(player.x, player.y-55);
  app.stage.addChild(name);

  let redBar = new PIXI.Graphics();
  redBar.lineStyle(1, 0x000000, 1);
  redBar.beginFill(0xFF0000);
  redBar.drawRect(player.x-40, player.y-40, 80, 10);
  redBar.endFill();
  app.stage.addChild(redBar);

  let greenBar = new PIXI.Graphics();
  greenBar.lineStyle(1, 0x000000, 1);
  greenBar.beginFill(0x008111);
  greenBar.drawRect(player.x-40, player.y-40, Math.max(0,player.health*(80/1000)), 10);
  greenBar.endFill();
  app.stage.addChild(greenBar);
}


let len = items.length;
for (let i=0; i<len; i++){
  let itemSprite = new PIXI.Sprite(PIXI.loader.resources['static/client/sprites/' + items[i].spriteName].texture);

  itemSprite.anchor.set(0.5,0.5);
  itemSprite.x = items[i].x-currentPlayer.xAbsolute+500;
  itemSprite.y = items[i].y-currentPlayer.yAbsolute+400;
  app.stage.addChild(itemSprite);
}

let length = bullets.length;
for (let i=0; i<length; i++){
  let bulletSprite = new PIXI.Sprite(PIXI.loader.resources['static/client/sprites/bullet.png'].texture);

  bulletSprite.anchor.set(0.5,0.5);
  bulletSprite.x = bullets[i].x-currentPlayer.xAbsolute+500;
  bulletSprite.y = bullets[i].y-currentPlayer.yAbsolute+400;
  app.stage.addChild(bulletSprite);
}

let miniMap = new PIXI.Graphics();
miniMap.lineStyle(1, 0x000000, 1);
miniMap.beginFill('black', 0.5);
miniMap.drawRect(880, 680, 100, 100);
miniMap.endFill();
app.stage.addChild(miniMap);
for (let id in players) {
  let player = players[id];
  let pointPlayer = new PIXI.Graphics();

  if(player.x == 500 && player.y == 400)
    pointPlayer .beginFill(0x008111);
  else
    pointPlayer .beginFill(0xFF0000);
  pointPlayer.drawCircle(880+(player.x+currentPlayer.xAbsolute-500)/5000*100, 680+(player.y+currentPlayer.yAbsolute-400)/5000*100, 3);
  pointPlayer.endFill();
  app.stage.addChild(pointPlayer);
}

let leaderboardBackground = new PIXI.Graphics();
leaderboardBackground.lineStyle(2, 0x000000, 0.7);
leaderboardBackground.beginFill('black', 0.3);
leaderboardBackground. drawRoundedRect(790, 10, 200, 200, 10);
leaderboardBackground.endFill();
app.stage.addChild(leaderboardBackground);

let leaderboardVerticalLine = new PIXI.Graphics();

leaderboardVerticalLine.beginFill(0x000000, 0.7);
leaderboardVerticalLine.drawRect(930, 20, 2, 180);
leaderboardVerticalLine.endFill();
app.stage.addChild(leaderboardVerticalLine);

let leaderboardHorizontalLine = new PIXI.Graphics();

leaderboardHorizontalLine.beginFill(0x000000, 0.7);
leaderboardHorizontalLine.drawRect(800, 40, 180, 2);
leaderboardHorizontalLine.endFill();
app.stage.addChild(leaderboardHorizontalLine);




  let leaderboardTitle = new PIXI.Text("NICK              KILLS");
  leaderboardTitle.style = {fill: 'white', strokeThickness: 0, fontSize: 15};
  leaderboardTitle.position.set(850, 20);
  app.stage.addChild(leaderboardTitle);

    for (let i=0; i<leaderboard.length; i++ ) {
      let entryName = new PIXI.Text(i+1+". " + leaderboard[i].name);
      entryName.anchor.set(0.5,0.5);
      entryName.style = {fill: 'white', strokeThickness: 0, fontSize: 15};
      entryName.position.set(860, 55+i*20);
      app.stage.addChild(entryName);

      let entryKills = new PIXI.Text(leaderboard[i].score);
      entryKills.anchor.set(0.5,0.5);
      entryKills.style = {fill: 'white', strokeThickness: 0, fontSize: 15};
      entryKills.position.set(960, 55+i*20);
      app.stage.addChild(entryKills);

      if(i>=7)
        break;
    }
}
