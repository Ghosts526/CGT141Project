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
        this.pause = true;
        this.isGameOver = false;
        this.backgroundSpeed = 5;
        this.backgroundX = 0;
        this.backgroundY = 0;
        this.backgroundImage = new Image();
        this.backgroundImage.src = "images/SpaceBackground256x256.jpg"; // Your image path
        this.healthBarUI = new Image();
        this.healthBarUI.src = "images/HealthBarDisplay.png";
        this.shieldBarUI = new Image();
        this.shieldBarUI.src = "images/ShieldBarDisplay.png";
        this.moveUp = false;
        this.moveDown = false;
        this.shoot = false;
        this.shootMissile = false;
        this.upButton = { x: 10, y: 380, width: 100, height: 100 };
        this.downButton = { x: 10, y: 500, width: 100, height: 100 };
        this.fireButton = { x: 1090, y: 380, width: 100, height: 100 };
        this.missileButton = { x: 1090, y: 500, width: 100, height: 100 };
        this.pauseButton = { x: 1090, y: 10, width: 100, height: 100 };
        this.lastTime = 0;
        this.pixelScale = 50;
        this.activeTouches = {};
        this.scaleX = 1;
        this.scaleY = 1;
    }

    setUp(enemySpawner) {
        // Insert canvas if not already in DOM
        if (!this.canvas.parentNode) {
            this.document.body.insertBefore(this.canvas, this.document.body.childNodes[0]);
        }
        // Set the drawing buffer size ONCE
        this.canvas.width = 1200;
        this.canvas.height = 675;
        this.enemySpawner = enemySpawner;
        this.addResizeListeners();
        this.startY = this.canvas.height / 2;
    }

    resizeCanvas() { // Resizes the canvas to fit onto the screen while keeping the ratio consistent
        // Get the window width and height
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Check if the width and height are displayed correctly with the aspect
        const aspect = 16 / 9; // 16:9 ratio

        // Set the width and height to be 16:9 ratio
        let displayWidth = windowWidth;
        let displayHeight = windowWidth / aspect;

        // If the height is too large for the window, make the width smaller instead
        if (displayHeight > windowHeight) {
            displayHeight = windowHeight;
            displayWidth = windowHeight * aspect;
        }

        // Set CSS size based on calcuations to fit onto the screen
        this.canvas.style.width = displayWidth + 'px';
        this.canvas.style.height = displayHeight + 'px';

        // Scale the pixel size to the actual canvas size 
        const rect = this.canvas.getBoundingClientRect();
        this.scaleX = 1200 / rect.width;
        this.scaleY = 675 / rect.height;
    }

    addResizeListeners() { // Calls the resizeCanvas function if the window resize or orientation changed
        const resizeHandler = () => this.resizeCanvas();
        window.addEventListener('resize', resizeHandler);
        window.addEventListener('orientationchange', resizeHandler);
        // Initial call on setUp
        this.resizeCanvas();
    }

    start(player, enemies, bullets) {
        // Uses deltaTime to get the time between frames
        const loop = (timestamp) => {
            if (!this.lastTime) this.lastTime = timestamp;

            let dt = (timestamp - this.lastTime) / 1000;
            this.lastTime = timestamp;

            if (this.pause) {
                dt = 0;
            }

            if (!this.pause) {
                this.updateGameArea(dt, bullets, player, enemies);
            }

            // Update the game every frame with accurate deltaTime
            if (!this.isGameOver) {
                requestAnimationFrame(loop);
            }
        };

        requestAnimationFrame(loop);
    }

    setupControls(player) {
        this.document.addEventListener('contextmenu', function (event) {
            event.preventDefault();
        });

        window.addEventListener('keydown', (e) => {
            console.log(e.key);
            if (e.key.toLowerCase() === 'w') player.moveUp = true;
            if (e.key.toLowerCase() === 's') player.moveDown = true;
            if (e.key === ' ') {
                e.preventDefault();
                player.shoot = true;
            }
            if (e.key.toLowerCase() === 'e') player.shootMissile = true;
            if (e.key === 'Escape') {
                if (this.pause) {
                    this.resumeGame();
                } else {
                    this.pauseGame();
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.key.toLowerCase() === 'w') player.moveUp = false;
            if (e.key.toLowerCase() === 's') player.moveDown = false;
            if (e.key === ' ') {
                player.shoot = false;
            }
            if (e.key.toLowerCase() === 'e') player.shootMissile = false;

        });

        // Add an eventlistener for touch buttons to detect onPress and onRelease
        window.addEventListener("touchstart", (e) => {
            const rect = this.canvas.getBoundingClientRect();
            for (const t of e.changedTouches) {
                this.activeTouches[t.identifier] = {
                    x: (t.clientX - rect.left) * this.scaleX,
                    y: (t.clientY - rect.top) * this.scaleY
                };
            }
        });

        window.addEventListener("touchend", (e) => {
            for (const t of e.changedTouches) {
                delete this.activeTouches[t.identifier];
            }
        });
    }

    clearGameArea() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    checkTouch(player) {
        // Reset states before checking all touches
        player.moveUpTouch = false;
        player.moveDownTouch = false;
        player.shootTouch = false;
        player.shootMissileTouch = false;

        for (const id in this.activeTouches) {
            const t = this.activeTouches[id];

            if (t.x >= this.upButton.x && t.x <= this.upButton.x + this.upButton.width &&
                t.y >= this.upButton.y && t.y <= this.upButton.y + this.upButton.height) {
                player.moveUpTouch = true;
            }

            if (t.x >= this.downButton.x && t.x <= this.downButton.x + this.downButton.width &&
                t.y >= this.downButton.y && t.y <= this.downButton.y + this.downButton.height) {
                player.moveDownTouch = true;
            }

            if (t.x >= this.fireButton.x && t.x <= this.fireButton.x + this.fireButton.width &&
                t.y >= this.fireButton.y && t.y <= this.fireButton.y + this.fireButton.height) {
                player.shootTouch = true;
            }

            if (t.x >= this.missileButton.x && t.x <= this.missileButton.x + this.missileButton.width &&
                t.y >= this.missileButton.y && t.y <= this.missileButton.y + this.missileButton.height) {
                player.shootMissileTouch = true;
            }

            if (t.x >= this.pauseButton.x && t.x <= this.pauseButton.x + this.pauseButton.width &&
                t.y >= this.pauseButton.y && t.y <= this.pauseButton.y + this.pauseButton.height) {
                this.pauseGame();
            }
        }
    }


    drawBackground(dt) {
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
        this.backgroundX -= this.backgroundSpeed * dt * this.pixelScale;

        // Reset when one tile fully leaves the screen
        if (this.backgroundX <= -imgW) {
            this.backgroundX += imgW;
        }
    }

    drawButtons(player) {
        const buttons = [this.upButton, this.downButton, this.fireButton, this.missileButton, this.pauseButton];

        for (let i = 0; i < buttons.length; i++) {
            this.context.save();
            this.context.translate(buttons[i].x, buttons[i].y);
            this.context.globalAlpha = 0.5;

            this.context.fillStyle = "gray";
            this.context.fillRect(0, 0, buttons[i].width, buttons[i].height);

            if (i == 2 || i == 3) {
                let startAngle = Math.PI / -2;
                let endAngle = Math.PI * 1.5;
                let length = 2 * Math.PI;
                let center = { x: buttons[i].width / 2, y: buttons[i].height / 2 };
                let duration = (i == 2) ? player.fireTimer / player.fireDelay : player.missileTimer / player.missileDelay;

                let currentAngle = length * duration + startAngle;

                if (currentAngle < endAngle && currentAngle > startAngle) {
                    this.context.fillStyle = "gray";
                    this.context.strokeStyle = "gray";
                    this.context.globalAlpha = 0.75;
                    this.context.beginPath();
                    this.context.moveTo(center.x, center.y);
                    this.context.arc(center.x, center.y, center.x, currentAngle, endAngle);
                    this.context.closePath;
                    this.context.fill();
                    this.context.stroke();
                }
            }

            this.context.restore();
        }
    }

    // Bars is 10:1 ratio
    drawHealth(player) {
        this.context.save();
        this.context.translate(10, 10);
        this.context.globalAlpha = 0.75;

        let barLength = 260;
        let hp = (player.hp / player.maxHp * barLength).toFixed(2);

        this.context.fillStyle = "red";
        this.context.fillRect(32, 3, (hp >= 0) ? hp : 0, 26);
        this.context.fillStyle = "gray";
        this.context.fillRect(barLength + 32, 3, (hp - barLength >= -barLength) ? hp - barLength : -barLength, 26);

        this.context.drawImage(this.healthBarUI, 0, 0, 295, 32); // Health Bar Overlay

        this.context.restore();
    }

    drawShieldHealth(player) {
        this.context.save();
        this.context.translate(325, 10);
        this.context.globalAlpha = 0.75;

        let barLength = 260;
        let hp = (player.shieldHP / player.maxShieldHP * barLength).toFixed(2);
        let regenHp = (player.shieldTimer / player.shieldDelay * barLength).toFixed(2);

        this.context.fillStyle = "rgb(0, 0, 175)";
        this.context.fillRect(32, 3, (hp >= 0) ? hp : 0, 26);
        this.context.fillStyle = "gray";
        this.context.fillRect(barLength + 32, 3, (hp - barLength >= -barLength) ? hp - barLength : -barLength, 26);
        this.context.fillStyle = "yellow";
        this.context.fillRect(32, 3, (regenHp >= 0) ? regenHp : 0, 26);

        this.context.drawImage(this.shieldBarUI, 0, 0, 295, 32); // Health Bar Overlay

        this.context.restore();
    }

    // Draws all the images on the canvas
    updateGameArea(dt, bullets, player, enemies) {
        this.clearGameArea();

        this.resizeCanvas();

        this.drawBackground(dt);

        for (let i = bullets.length - 1; i >= 0; i--) {
            bullets[i].newPos(dt);
            bullets[i].update(this.context);

            // Remove if off-screen
            if (bullets[i].x < 0 || bullets[i].x > this.canvas.width || bullets[i].y < 0 || bullets[i].y > this.canvas.height) {
                bullets.splice(i, 1);
            }
        }

        player.newPos(dt);
        if (player.y - player.height / 2 <= 0) {
            player.y = player.height / 2;
        }
        if (player.y + player.height / 2 >= this.canvas.height) {
            player.y = this.canvas.height - player.height / 2;
        }
        player.update(this.context, bullets, dt);


        this.enemySpawner.waves(this.context, enemies, dt);

        for (let i = enemies.length - 1; i >= 0; i--) {
            enemies[i].newPos(dt);
            enemies[i].update(this.context, bullets);
            enemies[i].tryShoot(bullets, dt);

            if (enemies[i].x + (enemies[i].width / 2) <= 0) {
                enemies[i].x = this.canvas.width + (enemies[i].width / 2);
            }
        }

        this.collision.collisionCheck(bullets, player, enemies, () => this.gameOver());

        this.drawHealth(player);

        this.drawShieldHealth(player);

        this.drawButtons(player);

        this.checkTouch(player);
    }


    pauseGame() {
        this.pause = true;
        this.document.getElementById("pauseButton").onclick = () => this.resumeGame();
        this.document.getElementById("pauseButton").innerText = "Resume Game";
        this.document.getElementById("uiNav").classList.remove("visuallyHidden");
    }

    resumeGame() {
        this.pause = false;
        this.document.getElementById("pauseButton").onclick = () => this.pauseGame();
        this.document.getElementById("pauseButton").innerText = "Pause Game";
        this.document.getElementById("uiNav").classList.add("visuallyHidden");
    }

    gameOver() {
        this.isGameOver = true;
        const ctx = this.context;
        ctx.font = "60px Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Game Over!", ctx.canvas.width / 2, ctx.canvas.height / 2);
        ctx.fillStyle = "yellow";
        ctx.font = "30px Arial";
        ctx.fillText("Credits Earned: " + parseInt(this.collision.score, 10), ctx.canvas.width / 2, ctx.canvas.height / 2 + 60);
        if (parseInt(localStorage.getItem("topScore"), 10) < this.collision.score) {
            localStorage.setItem("topScore", this.collision.score.toString());
        }
        localStorage.setItem("credits", (parseInt(localStorage.getItem("credits"), 10) + parseInt(this.collision.score, 10)).toString());
    }
}