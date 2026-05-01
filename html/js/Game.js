import { Player } from "./Player.js";
import { EnemySpawner } from "./EnemySpawner.js";
import { GameArea } from "./GameArea.js";
import { Sound } from "./Sound.js";
import { IMAGE_SRC } from "./Assets.js"

/**
 * This is the main script for the setup of the Gameplay
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
const enemySpawner = new EnemySpawner();

const playerImgs = [];
const enemyImgs = [];
const projectileImgs = [];
const uiImgs = [];

// Creates an image refrence that'll be used in the game (not creating multiple images objs)
// and prevents flickering when loading it the first time 
function preloadImages() {
    for (const [category, imgs] of Object.entries(IMAGE_SRC)) {
        for (const src of imgs) {
            const img = new Image();
            img.src = src;
            switch (category) {
                case "PLAYER": 
                    playerImgs.push(img);
                    break;
                case "ENEMY": 
                    enemyImgs.push(img);
                    break;
                case "PROJECTILES": 
                    projectileImgs.push(img);
                    break;
                case "UI": 
                    uiImgs.push(img);
                    break;
                default:
                    console.warn("No container for: Category=" + category + " | SRC=" + src);
            }
        }   
    }
}

function gameMenu() {
    window.location.href = 'gameMenu.html';
}

function startGame() {
    gameArea.resumeGame();
    enemySpawner.setImages(enemyImgs, projectileImgs);
    gameArea.setUp(enemySpawner, projectileImgs, uiImgs);
    const playerWidth = 60, playerHeight = 60, widthMultiplyer = 0.4;
    startX = playerWidth + 50, startY = gameArea.startY - playerHeight;
    player = new Player(startX, startY, playerWidth * widthMultiplyer, playerHeight, playerImgs, widthMultiplyer, projectileImgs);
    gameArea.start(player, enemies, bullets);
    document.getElementById("gameButton").onclick = restartGame;
    document.getElementById("gameButton").innerText = "Restart Game";
    gameArea.setupControls(player);
    const backgroundMusic = new Sound("audio/backgroundMusic.mp3", true, 0.5, 1, 1.0);
    backgroundMusic.play();
}

function restartGame() {
    gameArea.lastTime = 0;
    player.restart(startX, startY);
    bullets.length = 0, enemies.length = 0;
    enemySpawner.restart();
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
window.onload = preloadImages;