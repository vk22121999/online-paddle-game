var { name } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});
var canvas;
var canvasContext;
var ballX = 800 / 2;
var ballY = getRandomArbitrary(100, 500);
var ballSpeedX = -10;
var ballSpeedY = getRandomArbitrary(-2, 5);
var player1Score = 0;
var player2Score = 0;
var flag = false;

var player = 1;
var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;
const socket = io.connect("https://paddle-online.herokuapp.com/");

function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  }
}

window.onload = function () {
  console.log("heelo world");

  
  console.log(name)
  if (name != undefined && sessionStorage.getItem("name")) {
    alert("player 1")
  } else {
    alert("player 2")
    
    player = 2;
  }

 // const socket = io.connect("http://localhost:5000");
  //const socket = io.connect("https://paddlepong.herokuapp.com");


  socket.emit('join', name);

  socket.on('ball', (data) => {
    if(player === 1)
    {
     
      ballX = data.ballX;
      ballY = data.ballY;
      console.log(ballX,ballY);
    }
  
   // console.log("vaa da")
  });

  socket.on('changeMade1', (data) => {
    if (player === 2)
      paddle1Y = data.paddle1Y;
     // console.log("lolololololi");
  });

  socket.on('changeMade2', (data) => {
    
    if (player === 1)
      paddle2Y = data.paddle2Y;
  });
  socket.on('game-reset-recieve', (data) => {
    
    
        flag = data.flag;
      player1Score = data.player1Score;
      player2Score = data.player2Score;
      ballSpeedX =data.ballSpeedX;
      ballSpeedY = data.ballSpeedY;
      ballX = data.ballX;
      ballY = data.ballY
      
  });

  socket.on('change-arb-recieve', (data) => {
    if (player === 1)
    {
      
      flag = data.flag;
      player1Score = data.player1Score;
      player2Score = data.player2Score;
     
      
    }
    
  });

  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');
  var framesPerSecond = 30;

  setInterval(function () {
    if (flag) { moveEverything(); }
    drawEverything();
  }, 1000 / framesPerSecond);

  canvas.addEventListener('mousemove',
    function (evt) {
      var mousePos = calculateMousePos(evt);
      if (player === 1) {
        paddle1Y = mousePos.y - (PADDLE_HEIGHT / 2);
        socket.emit('change1', { paddle1Y, player, name })
      } else if (player === 2) {
        paddle2Y = mousePos.y - (PADDLE_HEIGHT / 2);
        socket.emit('change2', { paddle2Y, player, name })
      }
    });
  if (flag == false && player === 2) {
    window.addEventListener('keyup',
      function (event) {
        if (event.keyCode === 32) {
          flag = true;
          player1Score = player2Score = 0;
          socket.emit('change-arb', { flag, name ,player1Score,player2Score});

        }
      });
  }
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min);
}

function ballReset() {
  
  flag = false;
  ballSpeedX = 10;
  ballSpeedY = getRandomArbitrary(-2, 5);
  ballX = canvas.width / 2;
  ballY = getRandomArbitrary(100, canvas.height - 100);
  socket.emit("game-reset",{name,flag,ballSpeedX,ballSpeedY,ballX,ballY,player1Score,player2Score});
}

function moveEverything() {
  // computerMovement();
  //const socket1 = io.connect("http://localhost:5000");
  if(player===2)
  {
    
    socket.emit("ball-every",{ballX,ballY,name});
    ballX = ballX + ballSpeedX;
    ballY = ballY + ballSpeedY;
  } 

  
  
   
  

  if (ballX < 1) {
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
   //  if (player === 1) {
      var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
     // socket.emit("change-ball1", { ballSpeedY, name, ballX, ballY });
    //   }
      // if(player === 2)
      // {
      //   axios.get('/get1')
      //   .then(function (res) {
      //    // let res = JSON.parse(response);
      //     console.log(res,"1");
      //     if(res.data=="")
      //     {
      //       ballSpeedY=ballSpeedY;
      //       ballX = ballX;
      //       ballY = ballY;
      //     }
      //     else
      //     {
      //       ballSpeedY=res.data.ballSpeedY;
      //      // ballX = res.data.ballX;
      //      // ballY = res.data.ballY;
            
      //     }
         
      //   })
        
      // }
    }
    else {
      player1Score--;
      ballReset();
    }
  }

  if (ballX > canvas.width - 1) {
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
    //  if (player === 2) {
      var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
      // socket.emit("change-ball2", { ballSpeedY, name, ballX, ballY });
      //  }
      //  if(player === 1)
      //  {
      //    axios.get('/get2')
      //    .then(function (res) {
      //       //let res = JSON.parse(response);
      //       if(res.data=="")
      //     {
      //       ballSpeedY=ballSpeedY;
      //       ballX = ballX;
      //       ballY = ballY;
      //     }
      //     else{
      //       console.log(res,"2");
      //       ballSpeedY=res.data.ballSpeedY;
      //      // ballX = res.data.ballX;
      //      // ballY = res.data.ballY;
      //     }
            
            
      //    })
         
      //  }
       
    }
    else {
      player2Score--;
      ballReset();
    }
  }
  if (ballY > canvas.height || ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
}

function drawNet() {
  for (var i = 0; i < canvas.height; i += 40) {
    colorRect((canvas.width / 2) - 1, i, 2, 20, 'white');
  }
}

function drawEverything() {
  //console.log(ballX);  
  colorRect(0, 0, canvas.width, canvas.height, 'black');
  colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
  colorRect(canvas.width - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');

  if (flag) {
    colorCircle(ballX, ballY, 8, 'white');
    drawNet();
  }
  else if (player1Score < 0 && !flag) {
    canvasContext.font = "20px Verdana";
    canvasContext.fillText("Player-2-WINS-", (canvas.width / 2) - 200, canvas.height / 2);
  }
  else if (player2Score < 0 && !flag) {
    canvasContext.font = "20px Verdana";
    canvasContext.fillText("Player-1-WINS-", (canvas.width / 2) - 200, canvas.height / 2);

  }
  else if (player === 2) {
    canvasContext.font = "20px Verdana";
    canvasContext.fillText("Hit space-bar to Play", (canvas.width / 2) - 120, canvas.height / 2);
  }
  else if (player == 1) {
    canvasContext.font = "20px Verdana";
    canvasContext.fillText("Waiting for the Right Guy", (canvas.width / 2) - 120, canvas.height / 2);
  }
}

function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}
