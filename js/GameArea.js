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
        this.backgroundSpeed = 5;
        this.backgroundX = 0;
        this.backgroundY = 0;
        this.backgroundImage = new Image();
        this.backgroundImage.src = "images/SpaceBackground256x256.png"; // Your image path
        this.lastTime = 0;
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
            if (e.key.toLowerCase() === 'w') player.moveUp = -1;
            if (e.key.toLowerCase() === 's') player.moveDown = 1;
            if (e.key === ' ') {
                e.preventDefault();
                player.shoot = true;
            }
        })

        window.addEventListener('keyup', function(e) {
            if (e.key.toLowerCase() === 'w') player.moveUp = 0;
            if (e.key.toLowerCase() === 's') player.moveDown = 0;
            if (e.key === ' ') {
                player.shoot = false;
                player.fireTimer = 0;
            }
        })
    }

    clearGameArea() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBackground() {
        // 256 x 256 image
        const img = this.backgroundImage;
        const imgW = img.width;
        const imgH = img.height;

        // How many tiles we need to cover the canvas
        const tiles = Math.ceil(this.canvas.width / imgW) + 1;
        // How many rows we need to cover the canvas
        const rows = Math.ceil(this.canvas.height / imgH);

        for (let i = 0; i < tiles; i++) {
            for (let j = 0; j < rows; j++) {
                const x = this.backgroundX + i * imgW;
                const y = this.backgroundY + j * imgH;
                this.context.drawImage(img, x, y, imgW, imgH);
            }
        }

        // Scroll
        this.backgroundX -= this.backgroundSpeed;

        // Reset when one tile fully leaves the screen
        if (this.backgroundX <= -imgW) {
            this.backgroundX += imgW;
        }
    }

    drawHealth(player)
    {
        this.context.save();
        this.context.translate(10, 10);

        let barLength = 300;
        let hp = (player.hp / player.maxHp * barLength).toFixed(2);

        this.context.fillStyle = "red";
        this.context.fillRect(0, 0, hp, 30);
        this.context.fillStyle = "gray";
        this.context.fillRect(hp, 0, barLength - hp, 30);

        //this.context.drawImage(img, x, y, imgW, imgH); // Health Bar Overlay

        this.context.restore();
    }

    // Draws all the images on the canvas
    updateGameArea(bullets, player, enemies)
    {
        if (this.pause)
        {
            return;
        }

        this.clearGameArea();

        this.drawBackground();

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
        if (player.y - player.height/2 <= 0) {
            player.y = player.height/2;
        }
        if (player.y + player.height/2 >= this.canvas.height) {
            player.y = this.canvas.height - player.height/2;
        }
        player.update(this.context, bullets);


        this.waveSystem.waves(this.context, enemies);

        for (let i = enemies.length - 1; i >= 0; i--) {
            enemies[i].newPos();
            enemies[i].update(this.context, bullets);
            enemies[i].tryShoot(bullets, player);

            if (enemies[i].x + (enemies[i].width / 2) <= 0) {
                enemies[i].x = this.canvas.width + (enemies[i].width / 2);
            }
        }

        this.collision.collisionCheck(bullets, player, enemies, () => this.gameOver());

        this.document.getElementById("score").innerText = "Score: " + this.collision.score;

        this.drawHealth(player);
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
        if (parseInt(localStorage.getItem("topScore"), 10) < this.collision.score) 
        {
            localStorage.setItem("topScore", this.collision.score.toString());
        }
        localStorage.setItem("credits", (parseInt(localStorage.getItem("credits"), 10) + this.collision.score).toString());
    }
}