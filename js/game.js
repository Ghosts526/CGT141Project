import { Player } from "./Player.js";
import { WaveSystem } from "./WaveSystem.js";
import { GameArea } from "./GameArea.js";

function mainMenu()
{
    window.location.href = 'index.html';
}

var player;
var startX;
var startY;
const bullets = [];
const enemies = [];
var pause = false;
var isGameOver = false;
var gameArea = new GameArea(document.getElementById("gameScreen"));
var waveSystem = new WaveSystem();

function startGame()
{
    gameArea.start(player, enemies, bullets, pause);
    startX = gameArea.startX;
    startY = gameArea.startY;
    player = new Player((startX - 30), (startY - 30), 30, 30, "images/Spaceship.png");
    document.getElementById("gameButton").onclick = restartGame;
    document.getElementById("gameButton").innerText = "Restart Game";
    pause = false;
    isGameOver = false;
}

function restartGame()
{
    player = new Player((startX - 30), (startY - 30), 30, 30, "images/Spaceship.png");
    bullets.length = 0;
    enemies.length = 0;
    pause = false;
    isGameOver = false;
    waveSystem = new WaveSystem();
    resumeGame();
    gameArea.updateGameArea(pause, bullets, player, enemies);
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
    let ctx = gameArea.context;
    ctx.font = "60px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Game Over!", ctx.canvas.width/2, ctx.canvas.height/2);
}