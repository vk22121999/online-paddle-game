
  var ballX = 800 / 2;
  var ballY = getRandomArbitrary(100, 500);
  var ballSpeedX = -10;
  var ballSpeedY = getRandomArbitrary(-2, 5);

  var flag = false;
  var socket;


  const PADDLE_THICKNESS = 10;
  const PADDLE_HEIGHT = 100;
  
  
  


 
  
  
   // const socket = io.connect("http://localhost:5000");
    //const socket = io.connect("https://paddlepong.herokuapp.com");
  
  
  
    socket.on('ball', (data) => {
    
        ballX = data.ballX;
        ballY = data.ballY;
   
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
  

    var framesPerSecond = 30;
  
    setInterval(function () {
      if (flag) { moveEverything(); }
      drawEverything();
    }, 1000 / framesPerSecond);
  
   
  
  export function getRandomArbitrary(min, max) {
    return Math.random() * (max - min);
  }
  
  function ballReset() {
    
    flag = false;
    ballSpeedX = 10;
    ballSpeedY = getRandomArbitrary(-2, 5);
    ballX = canvas.width / 2;
    ballY = getRandomArbitrary(100, canvas.height - 100);
    socket.emit("game-reset",{room,flag,ballSpeedX,ballSpeedY,ballX,ballY,player1Score,player2Score});
  }
  
  function moveEverything() {

    
      
      socket.emit("ball-every",{ballX,ballY,name:room});
      ballX = ballX + ballSpeedX;
      ballY = ballY + ballSpeedY;
    
  
  
    if (ballX < 1) {
      if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
        ballSpeedX = -ballSpeedX;
     
        var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
        ballSpeedY = deltaY * 0.35;
       
      }
      else {
        player1Score--;
        ballReset();
      }
    }
  
    if (ballX > canvas.width - 1) {
      if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
        ballSpeedX = -ballSpeedX;
      
        var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
        ballSpeedY = deltaY * 0.35;
          
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
  
 
  
  function drawEverything() {
    //console.log(ballX);  
    // colorRect(0, 0, canvas.width, canvas.height, 'black');
    // colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
    // colorRect(canvas.width - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
  
   if (player1Score < 0 && !flag) {
     
     // canvasContext.fillText("Player-2-WINS-", (canvas.width / 2) - 200, canvas.height / 2);
    }
    else if (player2Score < 0 && !flag) {
      
     // canvasContext.fillText("Player-1-WINS-", (canvas.width / 2) - 200, canvas.height / 2);
  
    }
   
  }
  
 