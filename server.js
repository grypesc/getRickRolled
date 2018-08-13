'use strict';

class Terrain {
  constructor(speedArg, typeArg) {
    this.speed = speedArg;
    this.type=typeArg;
  }
}

let Model =  require ('./static/server/Model.js');
let sand = new Terrain (3, 'sand');
let edge = new Terrain (3, 'edge');
let grass = new Terrain (5, 'grass');
//console.log(constants.width);

let model = new Model();
let map = model.getMap();

// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

// Starts the server.
server.listen(5000, '0.0.0.0');

// Add the WebSocket handlers
io.on('connection', function(socket) {
});

setInterval(function() {
  io.sockets.emit('message', 'hi!');
}, 1000);

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: '+add);
})



var players = {};


io.on('connection', function(socket) {
  socket.on('new player', function() {
    players[socket.id] = {
      x: 1000,
      y: 500
    };
  });

  socket.on('disconnect', function() {
    delete players[socket.id];
    console.log(players);
  });

  socket.on('input', function(data) {
    let player = players[socket.id] || {};
    let speed = map.square[Math.floor((player.y+25)/50)][Math.floor((player.x+25)/50)].speed;
    if (data.left) {
      player.x -= speed;
    }
    if (data.up) {
      player.y -= speed;
    }
    if (data.right) {
      player.x += speed;
    }
    if (data.down) {
      player.y += speed;
    }
    if (player.x<50) player.x=50;
    else if (player.x>100*50-100) player.x=100*50-100;
    if (player.y<50) player.y=50;
    else if (player.y>100*50-100) player.y=100*50-100;
  });


});

var playerMap=[];
for (var i = 0; i < 21; i++) {
  playerMap[i] = [];
  for (var j = 0; j < 21; j++) {
    playerMap[i][j]='grass';
  }
}

setInterval(function() {
  for (var key in players) {
    let thisPlayer=players[key];//players
    let thisPlayerAbsolute=thisPlayer;
    let emitPlayers = JSON.parse(JSON.stringify(players));
    for (var key2 in emitPlayers) {
      emitPlayers[key2].x=emitPlayers[key2].x - thisPlayer.x + 500//constants.width/2 + constants.playerSpriteWidth/2;
      emitPlayers[key2].y=emitPlayers[key2].y - thisPlayer.y + 400//constants.height/2 + constants.playerSpriteHeight/2;
    }

    for (var i = 0; i < 21; i++) {//map squares
      for (var j = 0; j < 21; j++) {
        playerMap[i][j]=map.square[Math.min(Math.max(Math.floor(players[key].y/50)-8+i , 0) , 99)]
                                  [Math.min(Math.max(Math.floor(players[key].x/50)-10+j , 0) , 99)].type;
      }
    }

    io.to(key).emit('update', emitPlayers, thisPlayer, thisPlayerAbsolute, playerMap);
  }}, 1000 / 60);





////////////////////////////////////////////////////////////////////////////////
