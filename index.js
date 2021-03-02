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

var io = require("socket.io")(server);

io.on("connection", socket => {

  socket.on("join", (name) => {
    console.log("name: ",name);
    socket.join(name);
  });

  socket.on("change", data => {
   console.log("hio",data);
    io.to(data.name).emit("changeMade", data)
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

