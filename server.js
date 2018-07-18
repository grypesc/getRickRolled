

var grass = {
  type: 'grass',
  speed: 5
}
var sand = {
  type: 'sand',
  speed: 3
}
var edge = {
  type: 'edge',
  speed: -1
}
var map = {
  square: [],
  heightInSquares: 100,
  widthInSquares: 100,

  initialize : function() {
    for (var i = 0; i < this.heightInSquares; i++) {
      this.square[i] = [];
      for (var j = 0; j < this.widthInSquares; j++) {
        if (i==0 || j==0)
          this.square[i][j]=edge;
        else
          this.square[i][j]=grass;

      }
    }
    for (var i = 1; i < 10; i++)
      for (var j = 1; j <= i; j++)
          this.square[i][j]=sand;
  },
}

map.initialize();
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

  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    if (data.left) {
      player.x -= 3;
    }
    if (data.up) {
      player.y -= 3;
    }
    if (data.right) {
      player.x += 3;
    }
    if (data.down) {
      player.y += 3;
    }
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
    thisPlayer=players[key];//players
    thisPlayerAbsolute=thisPlayer;
    var emitPlayers = JSON.parse(JSON.stringify(players));
    for (var key2 in emitPlayers) {
      emitPlayers[key2].x=emitPlayers[key2].x - thisPlayer.x + 500;
      emitPlayers[key2].y=emitPlayers[key2].y - thisPlayer.y + 400;
    }

    for (var i = 0; i < 21; i++) {//map squares
      for (var j = 0; j < 21; j++) {
        playerMap[i][j]=map.square[Math.min(Math.max(Math.floor(players[key].y/50)-10+i , 0) , 99)]
                                  [Math.min(Math.max(Math.floor(players[key].x/50)-10+j , 0) , 99)].type;
      }
    }

    io.to(key).emit('update', emitPlayers, thisPlayer, thisPlayerAbsolute, playerMap);
  }}, 1000 / 60);





////////////////////////////////////////////////////////////////////////////////
