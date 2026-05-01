import { Player } from "./Player.js";
import { EnemySpawner } from "./EnemySpawner.js";
import { GameArea } from "./GameArea.js";
import { Sound } from "./Sound.js";

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

const imagesSrc = [
    ["images/SpaceshipV3.1.png",
        "images/SpaceshipV3.2.png",
        "images/SpaceshipV3.3.png",
        "images/SpaceshipV3.4.png",
        "images/SpaceshipV3.5.png",
        "images/SpaceshipV3.hit.png"],
    ["images/EnemySpaceshipV1.1.png",
        "images/EnemySpaceshipV1.2.png",
        "images/EnemySpaceshipV1.3.png",
        "images/EnemySpaceshipV1.4.png",
        "images/EnemySpaceshipV1.5.png",
        "images/EnemySpaceshipV1.hit.png"],
    ["images/Blaster.png",
        "images/MissileProjectile.png",
        "images/ExplosionV1.png",
        "images/ExplosionV2.png",
        "images/ExplosionV3.png"]
];

const playerImgs = [];
const enemyImgs = [];
const projectileImgs = [];

// Creates an image refrence that'll be used in the game 
// and prevents flickering when loading it the first time
function preloadImages() {
    for (let i = 0; i < imagesSrc.length; i++) {
        for (let j = 0; j < imagesSrc[i].length; j++) {
            const img = new Image();
            img.src = imagesSrc[i][j]
            switch (i) {
                case 0:
                    playerImgs.push(img);
                    break;
                case 1:
                    enemyImgs.push(img);
                    break;
                case 2:
                    projectileImgs.push(img);
                    break;
                default:
                    console.warn("No container for: " + imagesSrc[i][j]);
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
    gameArea.setUp(enemySpawner, projectileImgs);
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