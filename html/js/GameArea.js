import { DOWN_BUTTON, ENEMY, FIRE_BUTTON, GAME_SIZE, MISSILE_BUTTON, PAUSE_BUTTON, PIXEL_SCALE, PLAYER, UP_BUTTON } from "./Constants.js";
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
        this.ctx = this.canvas.getContext("2d");
        this.collision = new Collision();
        this.pause = true, this.isGameOver = false;
        this.backgroundSpeed = 5;
        this.backgroundX = 0, this.backgroundY = 0;
        this.backgroundImage = new Image();
        this.backgroundImage.src = "images/SpaceBackground256x256.jpg"; // Your image path
        this.moveUp = false, this.moveDown = false;
        this.shoot = false, this.shootMissile = false;
        this.lastTime = 0;
        this.activeTouches = {};
        this.scaleX = 1, this.scaleY = 1;
        this.touchMode = (localStorage.getItem("touchMode") == "true");
        this.isTouchActive = false;
        this.MOUSE_ID = -1;
    }

    setUp(enemySpawner, projectiles, ui) {
        this.collision.setProjectiles(projectiles);
        this.ui = ui;

        // Insert canvas if not already in DOM
        if (!this.canvas.parentNode) {
            this.document.body.insertBefore(this.canvas, this.document.body.childNodes[0]);
        }

        this.canvas.width = GAME_SIZE.WIDTH;
        this.canvas.height = GAME_SIZE.HEIGHT;
        this.enemySpawner = enemySpawner;
        this.addResizeListeners();
    }

    resizeCanvas() { // Resizes the canvas to fit onto the screen while keeping the ratio consistent
        // Get the window width and height
        const windowWidth = window.innerWidth, windowHeight = window.innerHeight;

        // Check if the width and height are displayed correctly with the aspect
        const aspect = 16 / 9; // 16:9 ratio

        // Set the width and height to be 16:9 ratio
        let displayWidth = windowWidth, displayHeight = windowWidth / aspect;

        // If the height is too large for the window, make the width smaller instead
        if (displayHeight > windowHeight) {
            displayHeight = windowHeight;
            displayWidth = windowHeight * aspect;
        }

        // Set CSS size based on calcuations to fit onto the screen
        this.canvas.style.width = displayWidth + 'px';
        this.canvas.style.height = displayHeight + 'px';

        // Scale drawing buffer for mobile users
        const dpr = window.devicePixelRatio || 1; 

        this.canvas.width = GAME_SIZE.WIDTH * dpr;
        this.canvas.height = GAME_SIZE.HEIGHT * dpr;

        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Scale the pixel size to the actual canvas size 
        const rect = this.canvas.getBoundingClientRect();
        this.scaleX = GAME_SIZE.WIDTH / rect.width, this.scaleY = GAME_SIZE.HEIGHT / rect.height;
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

            if (this.pause || this.isGameOver) {
                dt = 0;
            }

            if (!this.pause && !this.isGameOver) {
                this.updateGameArea(dt, bullets, player, enemies);
            }

            this.checkTouch(player);

            // Update the game every frame with accurate deltaTime
            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop); // Initial recursive call
    }

    // Sets up the keyboard and touch controls
    setupControls(player) {
        this.canvas.addEventListener('contextmenu', function (event) {
            event.preventDefault();
        });

        this.canvas.addEventListener('keydown', (e) => {
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

        this.canvas.addEventListener('keyup', (e) => {
            if (e.key.toLowerCase() === 'w') player.moveUp = false;
            if (e.key.toLowerCase() === 's') player.moveDown = false;
            if (e.key === ' ') {
                player.shoot = false;
            }
            if (e.key.toLowerCase() === 'e') player.shootMissile = false;

        });

        if (this.touchMode) {
            // Add an eventlistener for touch buttons to detect onPress and onRelease
            this.canvas.addEventListener("touchstart", (e) => {
                this.isTouchActive = true;
                e.preventDefault();
                const rect = this.canvas.getBoundingClientRect();
                for (const t of e.changedTouches) {
                    this.activeTouches[t.identifier] = {
                        x: (t.clientX - rect.left) * this.scaleX,
                        y: (t.clientY - rect.top) * this.scaleY
                    };
                }
            }, { passive: false });

            this.canvas.addEventListener("touchend", (e) => {
                for (const t of e.changedTouches) {
                    delete this.activeTouches[t.identifier];
                }
                if (e.touches.length == 0) {
                    this.isTouchActive = false;
                }
            });
        }

        this.canvas.addEventListener("mousedown", (e) => {
            if (this.isTouchActive) return; // Ignores mouse input if touch is active

            const rect = this.canvas.getBoundingClientRect();

            this.activeTouches[this.MOUSE_ID] = {
                x: (e.clientX - rect.left) * this.scaleX,
                y: (e.clientY - rect.top) * this.scaleY
            };
        });

        this.canvas.addEventListener("mouseup", (e) => {
            if (this.isTouchActive) return; // Ignores mouse input if touch is active

            delete this.activeTouches[this.MOUSE_ID];
        });
    }

    clearGameArea() {
        this.canvas.width = this.canvas.width
    }

    checkTouch(player) {
        // Reset states before checking all touches
        player.moveUpTouch = false, player.moveDownTouch = false;
        player.shootTouch = false, player.shootMissileTouch = false;

        for (const id in this.activeTouches) {
            const t = this.activeTouches[id];

            if (!this.isGameOver) {
                if (this.touchMode) { // Only detects move up and down if they are displayed
                    if (t.x >= UP_BUTTON.X && t.x <= UP_BUTTON.X + UP_BUTTON.WIDTH &&
                        t.y >= UP_BUTTON.Y && t.y <= UP_BUTTON.Y + UP_BUTTON.HEIGHT) {
                        player.moveUpTouch = true;
                    }

                    if (t.x >= DOWN_BUTTON.X && t.x <= DOWN_BUTTON.X + DOWN_BUTTON.WIDTH &&
                        t.y >= DOWN_BUTTON.Y && t.y <= DOWN_BUTTON.Y + DOWN_BUTTON.HEIGHT) {
                        player.moveDownTouch = true;
                    }
                }

                if (t.x >= FIRE_BUTTON.X && t.x <= FIRE_BUTTON.X + FIRE_BUTTON.WIDTH &&
                    t.y >= FIRE_BUTTON.Y && t.y <= FIRE_BUTTON.Y + FIRE_BUTTON.HEIGHT) {
                    player.shootTouch = true;
                }

                if (t.x >= MISSILE_BUTTON.X && t.x <= MISSILE_BUTTON.X + MISSILE_BUTTON.WIDTH &&
                    t.y >= MISSILE_BUTTON.Y && t.y <= MISSILE_BUTTON.Y + MISSILE_BUTTON.HEIGHT) {
                    player.shootMissileTouch = true;
                }
            }

            if (t.x >= PAUSE_BUTTON.X && t.x <= PAUSE_BUTTON.X + PAUSE_BUTTON.WIDTH &&
                t.y >= PAUSE_BUTTON.Y && t.y <= PAUSE_BUTTON.Y + PAUSE_BUTTON.HEIGHT) {
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
                this.ctx.drawImage(img, x, y, imgW, imgH);
            }
        }

        // Scroll
        this.backgroundX -= this.backgroundSpeed * dt * PIXEL_SCALE;

        // Reset when one tile fully leaves the screen
        if (this.backgroundX <= -imgW) {
            this.backgroundX += imgW;
        }
    }

    drawButtons(player) {
        const buttons = [UP_BUTTON, DOWN_BUTTON, FIRE_BUTTON, MISSILE_BUTTON, PAUSE_BUTTON];

        for (let i = 0; i < buttons.length; i++) {
            if (!this.touchMode && i <= 1) continue;// Does not draw up/down buttons if touchMode is false

            this.ctx.save();
            this.ctx.translate(buttons[i].X, buttons[i].Y);
            this.ctx.globalAlpha = 0.65;

            const image = this.ui[i + 2];
            this.ctx.drawImage(image, 0, 0, buttons[i].WIDTH, buttons[i].HEIGHT);

            if (i == 2 || i == 3) {
                let startAngle = Math.PI / -2;
                let endAngle = Math.PI * 1.5;
                let length = 2 * Math.PI;
                let center = { x: buttons[i].WIDTH / 2, y: buttons[i].HEIGHT / 2 };
                let duration = (i == 2) ? player.fireTimer / PLAYER.FIRE_DELAY : player.missileTimer / PLAYER.MISSILE_DELAY;

                let currentAngle = length * duration + startAngle;

                if (currentAngle < endAngle && currentAngle > startAngle) {
                    this.ctx.fillStyle = "gray";
                    this.ctx.strokeStyle = "gray";
                    this.ctx.globalAlpha = 0.75;
                    this.ctx.beginPath();
                    this.ctx.moveTo(center.x, center.y);
                    this.ctx.arc(center.x, center.y, center.x, currentAngle, endAngle);
                    this.ctx.closePath;
                    this.ctx.fill();
                    this.ctx.stroke();
                }
            }

            this.ctx.restore();
        }
    }

    // Bars is 10:1 ratio
    drawHealth(player) {
        this.ctx.save();
        this.ctx.translate(10, 10);
        this.ctx.globalAlpha = 0.75;

        let barLength = 260;
        let hp = (player.hp / player.maxHp * barLength).toFixed(2);

        this.ctx.fillStyle = "red";
        this.ctx.fillRect(32, 3, (hp >= 0) ? hp : 0, 26);
        this.ctx.fillStyle = "gray";
        this.ctx.fillRect(barLength + 32, 3, (hp - barLength >= -barLength) ? hp - barLength : -barLength, 26);

        this.ctx.drawImage(this.ui[0], 0, 0, 295, 32); // Health Bar Overlay

        this.ctx.restore();
    }

    drawShieldHealth(player) {
        this.ctx.save();
        this.ctx.translate(325, 10);
        this.ctx.globalAlpha = 0.75;

        let barLength = 260;
        let hp = (player.shieldHP / player.maxShieldHP * barLength).toFixed(2);
        let regenHp = (player.shieldTimer / player.shieldDelay * barLength).toFixed(2);

        this.ctx.fillStyle = "rgb(0, 0, 175)";
        this.ctx.fillRect(32, 3, (hp >= 0) ? hp : 0, 26);
        this.ctx.fillStyle = "gray";
        this.ctx.fillRect(barLength + 32, 3, (hp - barLength >= -barLength) ? hp - barLength : -barLength, 26);
        this.ctx.fillStyle = "yellow";
        this.ctx.fillRect(32, 3, (regenHp >= 0) ? regenHp : 0, 26);

        this.ctx.drawImage(this.ui[1], 0, 0, 295, 32); // Shield Bar Overlay

        this.ctx.restore();
    }

    drawScore() {
        const ctx = this.ctx;

        ctx.save();
        ctx.translate(650, 26);
        ctx.globalAlpha = 0.75;

        ctx.fillStyle = "yellow";
        ctx.font = "32pt Arial";
        ctx.textBaseline = "middle";

        ctx.fillText("Score: " + this.collision.score, 0, 4);

        ctx.restore();
    }

    // Draws all the images on the canvas
    updateGameArea(dt, bullets, player, enemies) {
        this.clearGameArea();

        this.resizeCanvas();

        this.drawBackground(dt);

        for (let i = bullets.length - 1; i >= 0; i--) {
            bullets[i].newPos(dt);
            bullets[i].update(this.ctx);

            // Remove if off-screen
            if (bullets[i].x < 0 || bullets[i].x > GAME_SIZE.WIDTH) {
                bullets.splice(i, 1);
            }
        }

        player.newPos(dt);
        if (player.y - PLAYER.HEIGHT / 2 <= 0) {
            player.y = PLAYER.HEIGHT / 2;
        }
        if (player.y + PLAYER.HEIGHT / 2 >= GAME_SIZE.HEIGHT) {
            player.y = GAME_SIZE.HEIGHT - PLAYER.HEIGHT / 2;
        }
        player.update(this.ctx, bullets, dt);


        this.enemySpawner.waves(this.ctx, enemies, dt);

        for (let i = enemies.length - 1; i >= 0; i--) {
            enemies[i].newPos(dt, this.ctx);
            enemies[i].update(this.ctx);
            if (enemies[i].destroyed) {
                enemies.splice(i, 1);
                break;
            }
            enemies[i].tryShoot(bullets, dt);

            if (enemies[i].x + (ENEMY.WIDTH / 2) <= 0) {
                enemies[i].x = ENEMY.START_X;
            }
        }

        this.collision.collisionCheck(bullets, player, enemies, () => this.gameOver());

        this.drawHealth(player);

        this.drawShieldHealth(player);

        this.drawButtons(player);

        this.drawScore();
    }


    pauseGame() {
        this.pause = true;
        this.document.getElementById("uiNav").classList.remove("visuallyHidden");
    }

    resumeGame() {
        this.pause = false;
        this.document.getElementById("uiNav").classList.add("visuallyHidden");
    }

    gameOver() {
        this.isGameOver = true;
        const ctx = this.ctx;
        ctx.save();
        ctx.font = "60px Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Game Over!", GAME_SIZE.WIDTH / 2, GAME_SIZE.HEIGHT / 2);
        ctx.fillStyle = "yellow";
        ctx.font = "30px Arial";
        ctx.fillText("Credits Earned: " + parseInt(this.collision.score, 10), GAME_SIZE.WIDTH / 2, GAME_SIZE.HEIGHT / 2 + 60);
        if (parseInt(localStorage.getItem("topScore"), 10) < this.collision.score) {
            localStorage.setItem("topScore", this.collision.score.toString());
        }
        localStorage.setItem("credits", (parseInt(localStorage.getItem("credits"), 10) + parseInt(this.collision.score, 10)).toString());
        ctx.restore();
    }
}