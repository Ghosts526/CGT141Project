function mainMenu()
{
    window.location.href = 'index.html';
}

var myGamePiece;
var startx = 325;
var starty = 200;

function startGame()
{
    myGameArea.start();
    myGamePiece = new component(30, 30, "../images/PlayButton.png", (startx - 30), (starty - 30), "image");
    document.getElementById("gameButton").onclick = restartGame;
    document.getElementById("gameButton").innerText = "Restart Game";
}

function restartGame()
{
    console.log("Game Restarted");
    myGamePiece = new component(30, 30, "red", startx, starty, "../images/PlayButton.png");
    updateGameArea();
}

var myGameArea = {
    canvas : document.getElementById("gameScreen"),
    start : function() {
        this.canvas.width = 650;
        this.canvas.height = 400;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function(e) {
            if (e.key === 'w') myGamePiece.speedUp = -1;
            if (e.key === 's') myGamePiece.speedDown = 1;
            if (e.key === 'a') myGamePiece.speedLeft = -1;
            if (e.key === 'd') myGamePiece.speedRight = 1;
        })
        window.addEventListener('keyup', function(e) {
            if (e.key === 'w') myGamePiece.speedUp = 0;
            if (e.key === 's') myGamePiece.speedDown = 0;
            if (e.key === 'a') myGamePiece.speedLeft = 0;
            if (e.key === 'd') myGamePiece.speedRight = 0;
        })
    }, 
    clear : function()
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) 
{
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.angle = 0;
    this.speed = 1;
    this.moveAngle = 0;
    this.speedUp = 0;
    this.speedDown = 0;
    this.speedLeft = 0;
    this.speedRight = 0;
    this.x = x;
    this.y = y;
    this.update = function() 
    {
        ctx = myGameArea.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        if (type == "image") {
            ctx.drawImage(this.image,
            -this.width/2, -this.height/2,
            this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        }
        ctx.restore();
    }
    this.newPos = function()
    {
        if (this.speedLeft + this.speedRight != 0 || this.speedUp + this.speedDown) {
            this.image.src = "../images/PlayButton.png";
        } else {
            this.image.src = "../images/PlayButtonV7.png";
        }
        this.moveAngle = this.speedLeft + this.speedRight;
        this.angle += this.moveAngle * Math.PI / 180;
        this.x -= (this.speedUp + this.speedDown) * Math.sin(this.angle);
        this.y += (this.speedUp + this.speedDown) * Math.cos(this.angle);
    }
}

function updateGameArea()
{
    myGameArea.clear();
    myGamePiece.newPos();
    myGamePiece.update();
}