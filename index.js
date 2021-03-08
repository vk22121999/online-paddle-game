const express = require('express')
const app = express();
import getRandomArbitrary from ""
app.use(express.static('public'));

const port = process.env.PORT || 5000;

var server = app.listen(port, () => {
  console.log(`Server running on ${port}`);
});


let rooms = {}
var io = require("socket.io")(server);

io.on("connection", socket => {

  socket.on("join", (data) => {
    //console.log("ji ",data,socket.id)
    if(rooms[data.name])
    {
      if(data.player === 1)
      rooms[data.name]["player1"] = socket.id; 
      else
      rooms[data.name]["player2"] = socket.id;
    }
    else
    {
      if(data.player === 1)
      rooms[data.name] = {player1:socket.id,player2:"",game:{ballSpeedX:,ballSpeedY:,ballX:,ballY:,paddle1Y:,paddle2Y:}}
      else
      rooms[data.name] = {player2:socket.id,player1:""}
    
    }    
    console.log("hi: ",data.player,"   ",rooms);
    socket.join(data.name);
  });

  socket.on("change", data => {
   //console.log("hio",data);
   if(data.player==1)
   {
    io.to(rooms[data.room]["player2"]).emit("changeMade",data)
   }
   else
   io.to(rooms[data.room]["player1"]).emit("changeMade",data)
  });



  socket.on("change-arb", data => {
    
    io.to(data.name).emit("change-arb-recieve", data)
  });
   
  socket.on("ball-every",data =>{
   
    io.to(data.name).emit("ball", data);
  });
  socket.on("game-reset", data => {
    io.to(data.name).emit("game-reset-recieve", data)
  });

});

