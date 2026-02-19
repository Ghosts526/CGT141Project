import { Player } from "./Player.js";
import { Enemy } from "./Enemy.js";
import { GameArea } from "./GameArea.js";
import { WaveSystem } from "./WaveSystem.js";

function mainMenu()
{
    window.location.href = 'index.html';
}

var player;
var startx;
var starty;
const bullets = [];
const enemies = [];
var pause = false;
var isGameOver = false;
var myGameArea = new GameArea(document.getElementById("gameScreen"));
var waveSystem = new WaveSystem();

function startGame()
{
    myGameArea.start();
    player = new Player((startx - 30), (starty - 30), 30, 30, "images/Spaceship.png");
    document.getElementById("gameButton").onclick = restartGame;
    document.getElementById("gameButton").innerText = "Restart Game";
    pause = false;
    isGameOver = false;
}

function restartGame()
{
    player = new Player((startx - 30), (starty - 30), 30, 30, "images/Spaceship.png");
    bullets.length = 0;
    enemies.length = 0;
    pause = false;
    isGameOver = false;
    waveSystem = new WaveSystem();
    resumeGame();
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
    if (isGameOver) return;
    pause = false;
    document.getElementById("pauseButton").onclick = pauseGame;
    document.getElementById("pauseButton").innerText = "Pause Game";
}

window.mainMenu = mainMenu;
window.startGame = startGame;
window.restartGame = restartGame;
window.pauseGame = pauseGame;
window.resumeGame = resumeGame;

function gameOver()
{
    isGameOver = true;
    pauseGame();
    let ctx = myGameArea.context;
    ctx.font = "60px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Game Over!", ctx.canvas.width/2, ctx.canvas.height/2);
}

// Dot Product
function dot(a, b) 
{
    return a.x * b.x + a.y * b.y;
}

// Creates a u and v vector
function computeAxes(rect)
{
    const c = Math.cos(rect.angle);
    const s = Math.sin(rect.angle);

    rect.u = {x:  c, y: s};
    rect.v = {x: -s, y: c};
}

// Returns true if it overlaps and false if it doesn't
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

    return (Math.abs(projA - projB) <= (rA + rB));
}

// Returning true or false when collided
function SAT(objA, objB) // Using Separating Axis Theorem (SAT)
{
    let A = {
        center: { x: objA.x, y: objA.y },
        hw: objA.width / 2,
        hh: objA.height / 2,
        angle: objA.angle
    };

    let B = {
        center: { x: objB.x, y: objB.y },
        hw: objB.width / 2,
        hh: objB.height / 2,
        angle: objB.angle
    };

    computeAxes(A);
    computeAxes(B);

    const axes = [A.u, A.v, B.u, B.v];

    for (let L of axes) {
        if (!overlapOnAxis(A, B, L)) {
            return false; // No Collision
        }
    }
    return true; // Collision
}

function collisionCheck() 
{
    for (let i = bullets.length - 1; i >= 0; i--) {
        if (bullets[i].source == "Enemy") { // Enemy bullet
            if (SAT(bullets[i], player)) {
                player.hp -= 25;
                bullets.splice(i, 1);

                if (player.hp <= 0)
                {
                    gameOver();
                }
            }
        } else { // Player's Bullet
            // Check all enemies collision
            for (let j = enemies.length - 1; j >= 0; j--) {
                if (SAT(bullets[i], enemies[j])) {
                    enemies[j].hp -= 25;
                    bullets.splice(i, 1);

                    if (enemies[j].hp <= 0) {
                        enemies.splice(j, 1);
                    }
                    break; // Exit enemy loop after bullet is removed
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
        bullet.update(myGameArea.context);

        // Remove if off-screen
        if (bullet.x < 0 || bullet.x > myGameArea.canvas.width || bullet.y < 0 || bullet.y > myGameArea.canvas.height) 
        {
            bullets.splice(index, 1);
        }
    });

    player.newPos();
    player.update(myGameArea.context, bullets);

    waveSystem.waves(myGameArea.context, enemies);
    
    enemies.forEach((enemy) => {
        enemy.newPos(player);
        enemy.update(myGameArea.context, bullets);
        enemy.tryShoot(bullets, player);
    });

    collisionCheck();
}