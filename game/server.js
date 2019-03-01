'use strict';

let Model =  require ('./static/server/Model.js');
let model = new Model();
let express = require('express');
let http = require('http');
let path = require('path');
let socketIO = require('socket.io');

let app = express();
let server = http.Server(app);
let io = socketIO(server);

let bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.set('port', 54070);
app.use('/static', express.static(__dirname + '/static'));


// Routing
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../index.html'));

});

app.get('/menu.css', function(req, res) {
  res.sendFile(path.join(__dirname + '/../menu.css'));
});

app.get('/help.html', function(req, res) {
  res.sendFile(path.join(__dirname + '/../help.html'));
});

app.get('/mouse.png', function(req, res) {
  res.sendFile(path.join(__dirname + '/../img/mouse.png'));
});

app.get('/wasd.jpg', function(req, res) {
  res.sendFile(path.join(__dirname + '/../img/wasd.jpg'));
});

app.post('/goGame', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
  console.log(req.body);
  playersInQueue.push(req.body.nick);
});

server.listen(54070, "0.0.0.0");

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: '+add);
})


let bulletPhysics = model.getBulletPhysics();
let players = {};
let playersInQueue = [];

io.on('connection', function(socket) {
  socket.on('new player', function() {
    if (playersInQueue.length > 0) {
      let x,y;
      do {
        x = Math.floor(Math.random()*5000);
        y = Math.floor(Math.random()*5000);
      } while(!model.map.square[Math.floor(y/50)][Math.floor(x/50)].isPassable)

    players[socket.id] = model.getNewPlayer(x,y,1000,0, playersInQueue.shift());
  }
    else
      players[socket.id] = model.getNewPlayer(500,500,0,0, 'noName');
    console.log("Player connected: " + players[socket.id].name + " " + socket.id);
    model.leaderboard.addEntry(players[socket.id].name, socket.id, 0);
  });

  socket.on('disconnect', function() {
    for (let i=0; i<model.leaderboard.array.length; i++) {
      if  (model.leaderboard.array[i].socketId == socket.id) {
        model.leaderboard.array.splice(i,1);
        break;
      }
    }
    delete players[socket.id];
  });

  socket.on('input', function(input) {
    let player = players[socket.id] || {};
    let speed = model.map.square[Math.floor((player.y)/50)][Math.floor((player.x)/50)].speed;
    player.health -= model.map.square[Math.floor((player.y)/50)][Math.floor((player.x)/50)].damage;
    let oldX = player.x;
    let oldY = player.y;
    player.direction=input.direction;


    player.y = player.y - speed*input.up + speed*input.down;
    if (!model.map.square[Math.floor((player.y+25)/50)][Math.floor((player.x)/50)].isPassable || !model.map.square[Math.floor((player.y-25)/50)][Math.floor((player.x)/50)].isPassable ||
        !model.map.square[Math.floor((player.y)/50)][Math.floor((player.x+25)/50)].isPassable || !model.map.square[Math.floor((player.y)/50)][Math.floor((player.x-25)/50)].isPassable )
            player.y = oldY;

    player.x = player.x - speed*input.left + speed*input.right;
    if (!model.map.square[Math.floor((player.y+25)/50)][Math.floor((player.x)/50)].isPassable || !model.map.square[Math.floor((player.y-25)/50)][Math.floor((player.x)/50)].isPassable ||
        !model.map.square[Math.floor((player.y)/50)][Math.floor((player.x+25)/50)].isPassable || !model.map.square[Math.floor((player.y)/50)][Math.floor((player.x-25)/50)].isPassable)
          player.x = oldX;


    if (input.LMB == true)
      player.weapon.shoot( player.x, player.y, player.direction, bulletPhysics, socket.id);
    else
      player.weapon.triggered = 0;
  });


});

let playerMap=[];//used to send map to players, they get only 21x17 squares
for (let i = 0; i < 17; i++) {
  playerMap[i] = [];
  for (let j = 0; j < 21; j++) {
    playerMap[i][j]='grass';
  }
}

setInterval(function() {
  bulletPhysics.checkRange();
  bulletPhysics.update(model.getMap());
  bulletPhysics.checkHits(players);
  model.getItems().checkColissions(players);


  for (let key in players) {
    let thisPlayer=players[key];
    let thisPlayerAbsolute=thisPlayer;
    let emitPlayers = JSON.parse(JSON.stringify(players));
    for (let key2 in emitPlayers) {
      emitPlayers[key2].x=emitPlayers[key2].x - thisPlayer.x + 500;
      emitPlayers[key2].y=emitPlayers[key2].y - thisPlayer.y + 400;
    }

    if (io.sockets.connected[key] && thisPlayer.health <= 0) {
      if (io.sockets.connected[thisPlayer.killedBy]) {
        model.leaderboard.addPoint(thisPlayer.killedBy);
        }
      thisPlayer.dropItem(model.getItems().array);
      io.to(key).emit('death');
      io.sockets.connected[key].disconnect();
      continue;
    }



    for (let i = 0; i < 17; i++) {
      for (let j = 0; j < 21; j++) {
        playerMap[i][j]=model.map.square[Math.min(Math.max(Math.floor(players[key].y/50)-8+i , 0) , 99)]
        [Math.min(Math.max(Math.floor(players[key].x/50)-10+j , 0) , 99)].type;
      }
    }

    io.to(key).emit('update', emitPlayers, thisPlayer, thisPlayerAbsolute, playerMap, bulletPhysics.bullets, model.getItems().array, model.leaderboard.array);
  }}, 1000 / 60);





  ////////////////////////////////////////////////////////////////////////////////
