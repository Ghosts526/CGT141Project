import { Bullet } from "./Bullet.js";
import { Sound } from "./Sound.js";

/**
 * This class handles the creation, movement, shooting, and rendering 
 */

export class Enemy {
    // A constructor for the enemy class
    constructor(x, y, width, height, angle, image, score, widthMultiplier, context) {
        this.x = x, this.y = y;
        this.width = width, this.height = height;
        this.angle = angle
        this.speed = 4; this.ySpeed = 2;
        this.pixelScale = 50;
        this.addX = Math.sin(angle) * this.speed, this.addY = 0;
        this.image = new Image(), this.image.src = image + ".1.png";
        this.sprite = image;
        this.shootAt = (Math.floor(Math.random() * 2) + 1); // 1-2 seconds
        this.shootTimer = 0;
        this.hp = 5;
        this.score = score;
        this.showBox = localStorage.getItem("showCollisionBox");
        this.widthMultiplier = widthMultiplier;
        this.imageState = 1;
        this.oscillationTime = 0;

        // Random wave settings
        this.amplitude = Math.random() * 60 + 20;   // 20–60 px
        this.frequency = Math.random() * 2 + 1;     // 1–3 Hz
        this.phase = Math.random() * Math.PI * 2;   // 0–2π

        // Safe vertical center (keeps enemy 30px from edges)
        this.minY = 30;
        this.maxY = context.canvas.height - 30;
        this.baseY = Math.max(this.minY + this.amplitude,
                    Math.min(y, this.maxY - this.amplitude));

        this.shootSound = new Sound("../audio/lazerSoundEffect.mp3", false, 0, 8, .75);
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

        // Safety clamp (just in case)
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

        ctx.drawImage(this.image, -this.width / 2 / this.widthMultiplier, -this.height / 2, this.width / this.widthMultiplier, this.height);

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
            bullets.push(new Bullet(this.x, this.y, 5, 20, this.angle, "images/Blaster.png", "Enemy"));
            this.shootSound.play();
            this.shootAt = (Math.floor(Math.random() * 2) + 2); // 2-3 seconds
            this.shootTimer = 0;
        }
    }

    damaged(amount) {
        this.hp -= amount;
        this.image.src = this.sprite + ".hit.png";
        this.imageState = 51;
    }

    movingEffect() {
        switch (this.imageState) {
            case 1:
                this.image.src = this.sprite + ".2.png";
                break;
            case 10:
                this.image.src = this.sprite + ".3.png";
                break;
            case 20:
                this.image.src = this.sprite + ".4.png";
                break;
            case 30:
                this.image.src = this.sprite + ".5.png";
                break;
            case 40:
                this.image.src = this.sprite + ".4.png";
                break;
            case 50:
                this.image.src = this.sprite + ".3.png";
                this.imageState = 10;
                break;
            case 55:
                if (this.hp <= 0) {
                    this.destroyed = true
                } else {
                    this.imageState = 10;
                }
                break;
        }
        this.imageState++;
    }
}