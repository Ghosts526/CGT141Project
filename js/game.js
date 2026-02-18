//import * as math from 'mathjs';

function mainMenu()
{
    window.location.href = 'index.html';
}

var player;
var startx;
var starty;
const bullets = [];
var wave = 0;
const enemies = [];
var enemiesSpawning = 0;
var pause = false;

function startGame()
{
    myGameArea.start();
    player = new playerFunction((startx - 30), (starty - 30), 30, 30, "images/Spaceship.png");
    document.getElementById("gameButton").onclick = restartGame;
    document.getElementById("gameButton").innerText = "Restart Game";
    pause = false;
    
}

function restartGame()
{
    player = new playerFunction((startx - 30), (starty - 30), 30, 30, "images/Spaceship.png");
    bullets.length = 0;
    wave = 0;
    enemies.length = 0;
    enemiesSpawning = 0;
    pause = false;
    updateGameArea();
}

function pauseGame()
{
    pause = true;
    document.getElementById("pauseButton").onclick = resumeGame;
    document.getElementById("pauseButton").innerText = "Resume Game";
}

function resumeGame()
{
    pause = false;
    document.getElementById("pauseButton").onclick = pauseGame;
    document.getElementById("pauseButton").innerText = "Pause Game";
}

var myGameArea = {
    canvas : document.getElementById("gameScreen"),
    start : function() {
        this.canvas.width = 980;
        this.canvas.height = 600;
        startx = this.canvas.width/2;
        starty = this.canvas.height/2;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);

        window.addEventListener('keydown', function(e) {
            if (e.key === 'w') player.moveUp = -1;
            if (e.key === 'a') player.moveLeft = -1;
            if (e.key === 'd') player.moveRight = 1;
            if (e.key === ' ') {
                e.preventDefault();
                player.shoot = true;
            }
        })

        window.addEventListener('keyup', function(e) {
            if (e.key === 'w') player.moveUp = 0;
            if (e.key === 'a') player.moveLeft = 0;
            if (e.key === 'd') player.moveRight = 0;
            if (e.key === ' ') {
                player.shoot = false;
                player.hasShot = false;
            }
        })
    }, 
    clear : function()
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function playerFunction(x, y, width, height, image) 
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
    this.speed = 3;
    this.shoot = false;
    this.hasShot = false;
    this.x = x;
    this.y = y;
    this.hp = 100;

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
            bullets.push(new Bullet(this.x, this.y, 5, 20, this.angle, "images/Blaster.png", "Player"));
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

// A bullet class to create projectiles
class Bullet 
{
    // A constructor for the bullet class
    constructor(x, y, width, height, angle, image, source)
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
        this.source = source;
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

class Enemy
{
    // A constructor for the enemy class
    constructor(x, y, width, height, angle, image)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.angle = angle
        this.speed = 1;
        this.addX = Math.sin(angle) * this.speed;
        this.addY = -Math.cos(angle) * this.speed;
        this.image = new Image();
        this.image.src = image;
        this.shootAt = (Math.floor(Math.random() * 3) + 3) * 20;
        this.shootTimer = 0;
        this.hp = 25;
    }

    // Updates the enemy location based by its angle and speed
    newPos()
    {
        this.followPlayer();
        this.x += this.addX;
        this.y += this.addY;
        if (this.addX != 0 || this.addY != 0)
        {
            this.image.src = "images/SpaceshipMoving.png";
        } else {
            this.image.src = "image/Spaceship.png";
        }
    }

    // Draws the enemy to its current position and rotation
    update() 
    {
        ctx = myGameArea.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.drawImage(this.image, -this.width/2, -this.height/2, this.width, this.height);

        ctx.restore();
    }

    followPlayer()
    {
        
        this.angle = Math.atan2(player.y - this.y, player.x - this.x) + Math.PI / 2;
        this.addX = Math.sin(this.angle) * this.speed;
        this.addY = -Math.cos(this.angle) * this.speed;
    }

    tryShoot()
    {
        this.shootTimer++;
        if (this.shootTimer >= this.shootAt) {
            let xr = Math.floor(Math.random() * 61) - 30, yr = Math.floor(Math.random() * 61) - 30; // +/- 30 accuracy
            let newAngle = Math.atan2(player.y - this.y + yr, player.x - this.x + xr) + Math.PI / 2;
            bullets.push(new Bullet(this.x, this.y, 5, 20, newAngle, "images/Blaster.png", "Enemy"));
            this.shootAt = (Math.floor(Math.random() * 3) + 3) * 20; //error
            this.shootTimer = 0;
        }
    }
}

var timer = 0;

function waveSystem()
{
    if (enemies.length == 0 && enemiesSpawning == 0)
    {
        wave++;
        enemiesSpawning = 1 //3 * wave + 2;
        timer = 0;
    }
    
    timer += 1;

    if (enemiesSpawning > 0 && timer >= 100)
    {
        let x = 0, y = 0, angle = 0;
        let i = Math.floor(Math.random() * 4);

        if (i == 0) {
            x = Math.floor(Math.random() * myGameArea.canvas.width);
            y = 0;
            angle = Math.PI;
        } else if (i == 1) {
            x = Math.floor(Math.random() * myGameArea.canvas.width);
            y = myGameArea.canvas.height;
            angle = 0;
        } else if (i == 2) {
            x = 0;
            y = Math.floor(Math.random() * myGameArea.canvas.height);
            angle = Math.PI / 2;
        } else {
            x = myGameArea.canvas.width;
            y = Math.floor(Math.random() * myGameArea.canvas.height);
            angle = Math.PI / -2
        }

        enemies.push(new Enemy(x, y, 30, 30, angle, "images/Spaceship.png")); // Need to add the width, height, and angle
        enemiesSpawning--;
        timer = 0;
    }
}

// Dot Product
function dot(a, b) 
{
    return a.x * b.x + a.y * b.y;
}

function computeAxes(rect)
{
    const c = Math.cos(rect.angle);
    const s = Math.sin(rect.angle);

    rect.u = {x:  c, y: s};
    rect.v = {x: -s, y: c};
}

// Rect A, Rect B, Vec2 L
function overlapOnAxis(A, B, L)
{
    const projA = dot(A.center, L);
    const projB = dot(B.center, L);

    const rA = 
        A.hw * Math.abs(dot(A.u, L)) + 
        A.hh * Math.abs(dot(A.v, L));
    
    const rB = 
        B.hw * Math.abs(dot(B.u, L)) + 
        B.hh * Math.abs(dot(B.v, L));

    return (Math.abs(projA - projB) <= (rA + rB))
}

function collisionCheck()
{
    for (let i = 0; i < bullets.length; i++) {
        

        let hw = bullets[i].width / 2;
        let hh = bullets[i].height / 2;

        let A = {
            center: { x: bullets[i].x, y: bullets[i].y },
            hw: bullets[i].width / 2,
            hh: bullets[i].height / 2,
            angle: bullets[i].angle
        };

        if (bullets[i].source == "Enemy") { // Enemy bullet

            let B = {
                center: { x: player.x, y: player.y },
                hw: player.width / 2,
                hh: player.height / 2,
                angle: player.angle
            };

            computeAxes(A);
            computeAxes(B);

            const axes = [A.u, A.v, B.u, B.v];
            let collision = true;

            for (let L of axes) {
                if (!overlapOnAxis(A, B, L)) {
                    collision = false;
                    break;  
                }
            }

            if (collision) {
                player.hp -= 25;
                bullets.splice(i, 1);
            }

            
        } else { // Players Bullet
            // Check all enemies collision
            for (let i = 0; i < enemies.length; i++) {
                const enemy = enemies[i];

                let B = {
                    center: { x: enemy.x, y: enemy.y },
                    hw: enemy.width / 2,
                    hh: enemy.height / 2,
                    angle: enemy.angle
                };

                computeAxes(A);
                computeAxes(B);

                const axes = [A.u, A.v, B.u, B.v];
                let collision = true;

                for (let L of axes) {
                    if (!overlapOnAxis(A, B, L)) {
                        collision = false;
                        break;  
                    }
                }

                if (collision) {
                    enemy.hp -= 25;
                    bullets.splice(i, 1);

                    if (enemy.hp <= 0) {
                        enemies.splice(i, 1);
                    }
                }
            }
        }
    }
}

function updateGameArea()
{
    if (pause == true)
    {
        return;
    }

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

    player.newPos();
    player.update();

    waveSystem();
    
    enemies.forEach((enemy) => {
        enemy.newPos();
        enemy.update();
        enemy.tryShoot();
    });

    collisionCheck();
}