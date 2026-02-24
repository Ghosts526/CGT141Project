import { Collision } from "./Collision.js";

/**
 * Manages the canvas, rendering, and the main game loop.
 * 
 * Handles drawing, clearing the screen, and updating all game
 * objects each frame
 */

export class GameArea {
    constructor(doc) {
        this.document = doc;
        this.canvas = this.document.getElementById("gameScreen");
        this.context = this.canvas.getContext("2d");
        this.collision = new Collision();
        this.pause = false; 
        this.isGameOver = false;
    }

    setUp(waveSystem) {
        this.canvas.width = 980;
        this.canvas.height = 600;
        this.startX = this.canvas.width/2;
        this.startY = this.canvas.height/2;
        this.document.body.insertBefore(this.canvas, this.document.body.childNodes[0]);
        this.waveSystem = waveSystem;
    }

    start(player, enemies, bullets) {
        this.interval = setInterval(() => this.updateGameArea(bullets, player, enemies), 20);

        window.addEventListener('keydown', function(e) {
            if (e.key === 'w') player.moveUp = -1;
            if (e.key === 's') player.moveDown = 1;
            if (e.key === ' ') {
                e.preventDefault();
                player.shoot = true;
            }
        })

        window.addEventListener('keyup', function(e) {
            if (e.key === 'w') player.moveUp = 0;
            if (e.key === 's') player.moveDown = 0;
            if (e.key === ' ') {
                player.shoot = false;
                player.fireTimer = 0;
            }
        })
    }

    clearGameArea() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    updateGameArea(bullets, player, enemies)
    {
        if (this.pause)
        {
            return;
        }

        this.clearGameArea();

        for (let i = bullets.length - 1; i >= 0; i--) {
            bullets[i].newPos();
            bullets[i].update(this.context);

            // Remove if off-screen
            if (bullets[i].x < 0 || bullets[i].x > this.canvas.width || bullets[i].y < 0 || bullets[i].y > this.canvas.height) 
            {
                bullets.splice(i, 1);
            }
        }

        player.newPos();
        player.update(this.context, bullets);

        this.waveSystem.waves(this.context, enemies);

        for (let i = enemies.length - 1; i >= 0; i--) {
            enemies[i].newPos(player);
            enemies[i].update(this.context, bullets);
            enemies[i].tryShoot(bullets, player);
        }

        this.collision.collisionCheck(bullets, player, enemies, () => this.gameOver());
    }

    pauseGame()
    {
        this.pause = true;
        this.document.getElementById("pauseButton").onclick = () => this.resumeGame();
        this.document.getElementById("pauseButton").innerText = "Resume Game";
    }

    resumeGame()
    {
        if (this.isGameOver) return;
        this.pause = false;
        this.document.getElementById("pauseButton").onclick = () => this.pauseGame();
        this.document.getElementById("pauseButton").innerText = "Pause Game";
    }

    gameOver()
    {
        this.isGameOver = true;
        this.pauseGame();
        let ctx = this.context;
        ctx.font = "60px Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Game Over!", ctx.canvas.width/2, ctx.canvas.height/2);
    }
}