const express = require('express')
const app = express();
app.use(express.static('public'));

const port = process.env.PORT || 5000;

var server = app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

// app.get("/get1",function(req,res)
// {  let data;
 
//    redisClient.hget("value1",1,function(err,reply){
//      console.log("vaa daa1",reply)
//      res.send(JSON.parse(reply));
//   });

 
 
// });
// app.get("/get2",function(req,res)
// {  let data;
    
//   redisClient.hget("value2",2,function(err,reply){
//     console.log("vaa daa2",reply)
//     res.send(JSON.parse(reply));
//   });
  
// });
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
      rooms[data.name] = {player1:socket.id,player2:""}
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

