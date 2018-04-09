var canvas;
var canvasContext;

var ballX = 50;
var ballY = 50;
var ballSpeedX = 14;
var ballSpeedY = 4;

var framesPerSecond = 50;
var frequency = 1000 / framesPerSecond;

const PADDLE_WIDTH = 8;
const PADDLE_HEIGHT = 100;
var paddle1Y = 250;
var paddle2Y = 250;

var player1score = 0;
var player2score = 0;
const WINNING_SCORE = 5;

function drawRect(leftX, topY, width, height, color)
{
    canvasContext.fillStyle = color;
    canvasContext.fillRect(leftX,topY,width,height);
}

function drawBall(x, y, r, sAngle, eAngle, color)
{
    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(x, y, r, sAngle, eAngle);
    canvasContext.fill();
}

function drawNet()
{
    for (var i = 0; i < canvas.height; i+=40)
    {
        drawRect(canvas.width / 2 - 1, i, 2, 20, "white");
    }
}

function showScore()
{
    canvasContext.fillStyle = "white";
    canvasContext.font="20px Arial";
    canvasContext.fillText(player1score, 100, 100);
    canvasContext.fillText(player2score, canvas.width - 120, 100);
}

function calculateMousePos(evt)
{
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x:mouseX,
        y:mouseY
    };
}

function computerMovement()
{
    var paddle2Ycenter = paddle2Y + (PADDLE_HEIGHT / 2);
    if (paddle2Ycenter < ballY - 35)
        paddle2Y += 9;
    else if (paddle2Ycenter > ballY + 35)
        paddle2Y -= 9;   

}

function ballReset() 
{
    ballSpeedX = -ballSpeedX;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function checkLeftPaddle()
{
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT)
    {
        ballSpeedX = -ballSpeedX;
        var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
        ballSpeedY = 0.28 * deltaY;
    }
    else
    {
        player2score++;
        ballReset();
    }
}

function checkRightPaddle()
{
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT)
    {
        ballSpeedX = -ballSpeedX;
        var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
        ballSpeedY = 0.28 * deltaY;
    }
    else
    {
        player1score++;
        ballReset();
    }
}

function checkIfWin()
{
    return Boolean(player1score >= WINNING_SCORE || player2score >= WINNING_SCORE);
}

function showEndScreen()
{
    canvasContext.fillStyle = "white";
        if(player1score >= WINNING_SCORE)
        {
             canvasContext.fillText("Left Player Won!", 300, 450);              
        }
        else if (player2score >= WINNING_SCORE)
        {
           canvasContext.fillText("Right Player Won!", 300, 450);              
        }
        canvasContext.fillText("Click to continue", 300, 500);
}

function moveEverything()
{   
    if (checkIfWin())
        return;

    computerMovement();
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX > canvas.width)
    {
        checkRightPaddle();
    }
    else if (ballX < 0)
    {
        checkLeftPaddle();
    }

    if (ballY > canvas.height - 10)
        ballSpeedY = -ballSpeedY;
    else if (ballY < 10)
        ballSpeedY = -ballSpeedY;
}

function drawEverything()
{
    // draws black screen
    drawRect(0, 0, 
        canvas.width, 
        canvas.height, 
        "black");

    if (checkIfWin())
    {
        showEndScreen();
        return;
    }

    drawNet();

    drawBall(
        ballX, ballY,
        8, 0, Math.PI * 2, "#87CEEB");

    // draws left paddle
    drawRect(0, 
        paddle1Y, 
        PADDLE_WIDTH, 
        PADDLE_HEIGHT, 
        "white");

    // draws right paddle
    drawRect(
        canvas.width - PADDLE_WIDTH,
        paddle2Y,
        PADDLE_WIDTH,
        PADDLE_HEIGHT, 
        "white");

    showScore();    
}    

function handleMouseClick(evt)
{
    if(checkIfWin())
    {
        player1score = 0;
        player2score = 0;
    }
}


//        what happens on the screen when window becomes loaded
window.onload = function() 
{

    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext("2d");
    ballReset();
    setInterval(function() 
    {
        drawEverything();
        moveEverything();
}, frequency);

    canvas.addEventListener("mousedown",
        handleMouseClick);

    canvas.addEventListener("mousemove", 
        function(evt){
            var mousePos = calculateMousePos(evt);
            paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
            });
};
