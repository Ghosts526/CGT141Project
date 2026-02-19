import { Player } from "./Player.js";
import { GameArea } from "./GameArea.js";
import { WaveSystem } from "./WaveSystem.js";
import { Collision } from "./Collision.js";

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