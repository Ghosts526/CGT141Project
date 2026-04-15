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

let player;
let startX, startY;
const bullets = [], enemies = [];
const gameArea = new GameArea(document);
const waveSystem = new WaveSystem();

function gameMenu()
{
    window.location.href = 'gameMenu.html';
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
    gameArea.lastTime = 0;
    player.restart(startX, startY);
    bullets.length = 0;
    enemies.length = 0;
    waveSystem.restart();
    gameArea.collision.score = 0;
    if (gameArea.isGameOver) {
        gameArea.isGameOver = false;
        gameArea.start(player, enemies, bullets)
    }
    gameArea.resumeGame();
}

window.gameMenu = gameMenu;
window.startGame = startGame;
window.restartGame = restartGame;
window.pauseGame = () => gameArea.pauseGame();
window.resumeGame = () => gameArea.resumeGame();