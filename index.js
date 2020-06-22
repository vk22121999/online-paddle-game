const express = require('express')
const app = express();
app.use(express.static('public'));
const redis = require("redis");
let redisClient;
if (process.env.REDIS_URL) {
  redisClient = redis.createClient(process.env.REDIS_URL)
} else {
  redisClient = redis.createClient()
}
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
    socket.join(name);
  });

  socket.on("change1", data => {
    io.to(data.name).emit("changeMade1", data)
  });

  socket.on("change2", data => {
    io.to(data.name).emit("changeMade2", data)
  });

  socket.on("change-arb", data => {
    
    io.to(data.name).emit("change-arb-recieve", data)
  });
   
  socket.on("ball-every",data =>{
   
    io.to(data.name).emit("ball", data);
  });

});

  // socket.on("change-ball1", data => {
          
  //   console.log(JSON.stringify(data),"socket-1");
  //   redisClient.hset('value1', 1, JSON.stringify(data));
   
  // });

  // socket.on("change-ball2", data => {
        
  // redisClient.hset('value2', 2, JSON.stringify(data));
    
  // });

 

