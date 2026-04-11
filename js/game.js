import { Player } from "./Player.js";
import { WaveSystem } from "./WaveSystem.js";
import { GameArea } from "./GameArea.js";

/**
 * Game.js is my main script for the Game
 *
 * Handles game state, player/enemy/bullet management, and coordinates
 * the start, pause, and restart of the game
 * 
 * Connects all other javascript files together
 */

var player;
var startX, startY;
const bullets = [], enemies = [];
var gameArea = new GameArea(document);
var waveSystem = new WaveSystem();

function mainMenu()
{
    window.location.href = 'index.html';
}

function startGame()
{   
    gameArea.setUp(waveSystem);
    let playerWidth = 60, playerHeight = 60;
    let widthMultiplyer = 0.4;
    startX = playerWidth + 50;
    startY = gameArea.startY - playerHeight;
    player = new Player(startX, startY, playerWidth * widthMultiplyer, playerHeight, "images/SpaceshipV3", widthMultiplyer);
    gameArea.start(player, enemies, bullets);
    document.getElementById("gameButton").onclick = restartGame;
    document.getElementById("gameButton").innerText = "Restart Game";
}

function restartGame()
{
    player.restart(startX, startY);
    bullets.length = 0;
    enemies.length = 0;
    waveSystem.restart();
    gameArea.isGameOver = false;
    gameArea.collision.score = 0;
    gameArea.resumeGame();
    gameArea.updateGameArea(bullets, player, enemies);
}

window.mainMenu = mainMenu;
window.startGame = startGame;
window.restartGame = restartGame;
window.pauseGame = gameArea.pauseGame();
window.resumeGame = gameArea.resumeGame();