function mainMenu()
{
    window.location.href = 'index.html';
}

var myGamePiece;
var startx = 325;
var starty = 200;
const bullets = [];

function startGame()
{
    myGameArea.start();
    myGamePiece = new component(30, 30, "images/Spaceship.png", (startx - 30), (starty - 30), "image");
    document.getElementById("gameButton").onclick = restartGame;
    document.getElementById("gameButton").innerText = "Restart Game";
}

function restartGame()
{
    myGamePiece = new component(30, 30, "images/Spaceship.png", (startx - 30), (starty - 30), "image");
    bullets.length = 0;
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
            if (e.key === 'w') myGamePiece.moveUp = -1;
            if (e.key === 'a') myGamePiece.moveLeft = -1;
            if (e.key === 'd') myGamePiece.moveRight = 1;
            if (e.key === ' ') {
                e.preventDefault();
                myGamePiece.shoot = true;
            }
        })
        window.addEventListener('keyup', function(e) {
            if (e.key === 'w') myGamePiece.moveUp = 0;
            if (e.key === 'a') myGamePiece.moveLeft = 0;
            if (e.key === 'd') myGamePiece.moveRight = 0;
            if (e.key === ' ') {
                myGamePiece.shoot = false;
                myGamePiece.hasShot = false;
            }
        })
    }, 
    clear : function()
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, image, x, y) 
{
    // Set up variables for the player
    this.image = new Image();
    this.image.src = image;
    this.width = width;
    this.height = height;
    this.angle = 0;
    this.moveAngle = 0;
    this.moveUp = 0;
    this.moveLeft = 0;
    this.moveRight = 0;
    this.speed = 2;
    this.shoot = false;
    this.hasShot = false;
    this.x = x;
    this.y = y;

    // Updates the player image to its current position
    this.update = function() 
    {
        ctx = myGameArea.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.drawImage(this.image, -this.width/2, -this.height/2, this.width, this.height);

        if (this.shoot && !this.hasShot)
        {
            this.hasShot = true;
            bullets.push(new Bullet(this.x, this.y, 5, 20, this.angle, "images/Blaster.png"));
        }
        ctx.restore();
    }

    // Updates the position and angle of the player
    this.newPos = function()
    {
        if (this.moveLeft + this.moveRight != 0 || this.moveUp) {
            this.image.src = "images/SpaceshipMoving.png";
        } else {
            this.image.src = "images/Spaceship.png";
        }
        this.moveAngle = this.moveLeft + this.moveRight;
        this.angle += this.moveAngle * Math.PI / 180 * this.speed * 1.5;
        this.x -= this.moveUp * Math.sin(this.angle) * this.speed;
        this.y += this.moveUp * Math.cos(this.angle) * this.speed;
    }
}

class Bullet 
{
    // A constructor for the bullet class
    constructor(x, y, width, height, angle, image)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.angle = angle
        this.speed = 10;
        this.addX = Math.sin(angle) * this.speed;
        this.addY = -Math.cos(angle) * this.speed;
        this.image = new Image();
        this.image.src = image;
    }

    // Updates the bullet location based by its angle and speed
    newPos()
    {
        this.x += this.addX;
        this.y += this.addY;
    }

    // Draws the bullet to its current position and rotation
    update() 
    {
        ctx = myGameArea.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.drawImage(this.image, -this.width/2, -this.height/2, this.width, this.height);

        ctx.restore();
    }
}

function updateGameArea()
{
    myGameArea.clear();

    bullets.forEach((bullet, index) => {
        bullet.newPos();
        bullet.update();

        // Remove if off-screen
        if (bullet.x < 0 || bullet.x > myGameArea.canvas.width || bullet.y < 0 || bullet.y > myGameArea.canvas.height) 
        {
            bullets.splice(index, 1);
        }
    });

    myGamePiece.newPos();
    myGamePiece.update();
}