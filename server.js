'use strict';

let Model =  require ('./static/server/Model.js');
//console.log(constants.width);

let model = new Model();

// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 54070);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

// Starts the server.
server.listen(54070, "0.0.0.0");

// Add the WebSocket handlers
io.on('connection', function(socket) {
});


require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: '+add);
})



var players = {};


io.on('connection', function(socket) {
  socket.on('new player', function() {
    console.log("Player connected: " +socket.id)
    players[socket.id] = model.getNewPlayer(500,500,100,0);
  });

  socket.on('disconnect', function() {
    delete players[socket.id];
    console.log(players);
  });

  socket.on('input', function(data) {
    let player = players[socket.id] || {};
    let speed = model.map.square[Math.floor((player.y+25)/50)][Math.floor((player.x+25)/50)].speed;
    player.direction=data.direction;
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

    for (var i = 0; i < 21; i++) {
      for (var j = 0; j < 21; j++) {
        playerMap[i][j]=model.map.square[Math.min(Math.max(Math.floor(players[key].y/50)-8+i , 0) , 99)]
                                  [Math.min(Math.max(Math.floor(players[key].x/50)-10+j , 0) , 99)].type;
      }
    }

    io.to(key).emit('update', emitPlayers, thisPlayer, thisPlayerAbsolute, playerMap);
  }}, 1000 / 60);





////////////////////////////////////////////////////////////////////////////////
