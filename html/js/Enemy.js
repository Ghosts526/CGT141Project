import { Bullet } from "./Bullet.js";
import { Sound } from "./Sound.js";

/**
 * This class handles the creation, movement, shooting, and rendering 
 */

export class Enemy {
    // A constructor for the enemy class
    constructor(x, y, width, height, angle, images, score, widthMultiplier, context, projectiles) {
        this.x = x, this.y = y;
        this.width = width, this.height = height, this.angle = angle
        this.speed = 4; this.pixelScale = 50;
        this.addX = Math.sin(angle) * this.speed, this.addY = 0;
        this.images = images, this.sprite = images[0], this.imageState = 1;
        this.projectiles = projectiles;
        this.shootAt = (Math.floor(Math.random() * 2) + 1); // 1-2 seconds
        this.shootTimer = 0;
        this.hp = 5, this.score = score;
        this.showBox = localStorage.getItem("showCollisionBox");
        this.widthMultiplier = widthMultiplier;
        this.oscillationTime = 0;

        // Random wave movement settings
        this.amplitude = Math.random() * 60 + 20;   // 20–60 px
        this.frequency = Math.random() * 2 + 1;     // 1–3 Hz
        this.phase = Math.random() * Math.PI * 2;   // 0–2π

        // Safe vertical center (keeps enemy 30px from edges)
        this.minY = 30;
        this.maxY = context.canvas.height - 30;
        this.baseY = Math.max(this.minY + this.amplitude,
            Math.min(y, this.maxY - this.amplitude));

        this.shootSound = new Sound("audio/lazerSoundEffect.mp3", false, 0, 1, .75);
        this.destroyed = false;
    }

    // Updates the enemy location based by its angle and speed
    newPos(dt) {
        this.x += this.addX * dt * this.pixelScale;

        // Advance time
        this.oscillationTime += dt;

        // Smooth sine-wave vertical motion with randomness
        this.y = this.baseY +
            Math.sin(this.oscillationTime * this.frequency + this.phase) *
            this.amplitude;

        // Safety clamp
        if (this.y < this.minY) this.y = this.minY;
        if (this.y > this.maxY) this.y = this.maxY;
    }

    // Draws the enemy to its current position and rotation
    update(context) {
        const ctx = context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        this.movingEffect();

        ctx.drawImage(this.sprite, -this.width / 2 / this.widthMultiplier, -this.height / 2, this.width / this.widthMultiplier, this.height);

        // Display Hitbox
        if (this.showBox == "true") {
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
            ctx.stroke();
        }

        ctx.restore();
    }

    tryShoot(bullets, dt) {
        this.shootTimer += dt;
        if (this.shootTimer >= this.shootAt) {
            bullets.push(new Bullet(this.x, this.y, 5, 20, this.angle, this.projectiles[0], "Enemy"));
            this.shootSound.play();
            this.shootAt = (Math.floor(Math.random() * 2) + 2); // 2-3 seconds
            this.shootTimer = 0;
        }
    }

    damaged(amount) {
        this.hp -= amount;
        this.sprite = this.images[5];
        this.imageState = 51;
    }

    movingEffect() {
        switch (this.imageState) {
            case 1:
                this.sprite = this.images[1];
                break;
            case 10:
                this.sprite = this.images[2];
                break;
            case 20:
                this.sprite = this.images[3];
                break;
            case 30:
                this.sprite = this.images[4];
                break;
            case 40:
                this.sprite = this.images[3];
                break;
            case 50:
                this.sprite = this.images[2];
                this.imageState = 10;
                break;
            case 55:
                if (this.hp <= 0) {
                    this.shootSound.destroy();
                    this.shootSound = null;
                    this.destroyed = true
                } else {
                    this.imageState = 10;
                }
                break;
        }
        this.imageState++;
    }
}