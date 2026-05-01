import { Bullet } from "./Bullet.js";
import { Sound } from "./Sound.js";
import { ENEMY, PIXEL_SCALE, SHOW_HIT_BOX} from "./Constants.js";
import { AUDIO_SRC } from "./Assets.js";

/**
 * This class handles the creation, movement, shooting, and rendering 
 */

export class Enemy {
    // A constructor for the enemy class
    constructor(y, images, score, context, projectiles) {
        this.x = ENEMY.START_X, this.y = y;
        this.addX = Math.sin(ENEMY.ANGLE) * ENEMY.SPEED, this.addY = 0;
        this.images = images, this.sprite = images[0], this.imageState = 1;
        this.projectiles = projectiles;
        this.shootAt = (Math.floor(Math.random() * 2) + 1); // 1-2 seconds
        this.shootTimer = 0;
        this.hp = ENEMY.MAX_HP, this.score = score;
        this.oscillationTime = 0;

        // Random wave movement settings
        this.amplitude = Math.random() * 60 + 20;   // 20–60 px
        this.frequency = Math.random() * 2 + 1;     // 1–3 Hz
        this.phase = Math.random() * Math.PI * 2;   // 0–2π

        // Safe vertical center (keeps enemy 30px from edges)
        this.baseY = Math.max(ENEMY.MIN_Y + this.amplitude,
            Math.min(y, ENEMY.MAX_Y - this.amplitude));

        this.shootSound = new Sound("audio/lazerSoundEffect.mp3", false, 0, 1, .75);
        this.destroyed = false;
    }

    // Updates the enemy location based by its angle and speed
    newPos(dt) {
        this.x += this.addX * dt * PIXEL_SCALE;

        // Advance time
        this.oscillationTime += dt;

        // Smooth sine-wave vertical motion with randomness
        this.y = this.baseY +
            Math.sin(this.oscillationTime * this.frequency + this.phase) *
            this.amplitude;

        // Safety clamp
        if (this.y < ENEMY.MIN_Y) this.y = ENEMY.MIN_Y;
        if (this.y > ENEMY.MAX_Y) this.y = ENEMY.MAX_Y;
    }

    // Draws the enemy to its current position and rotation
    update(context) {
        const ctx = context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(ENEMY.ANGLE);

        this.movingEffect();

        ctx.drawImage(this.sprite, -ENEMY.WIDTH / 2, -ENEMY.HEIGHT / 2, ENEMY.WIDTH, ENEMY.HEIGHT);

        // Display Hitbox
        if (SHOW_HIT_BOX == "true") {
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.rect(-ENEMY.WIDTH / 2 * ENEMY.WIDTH_MULTIPLIER, -ENEMY.HEIGHT / 2, ENEMY.WIDTH * ENEMY.WIDTH_MULTIPLIER, ENEMY.HEIGHT);
            ctx.stroke();
        }

        ctx.restore();
    }

    tryShoot(bullets, dt) {
        this.shootTimer += dt;
        if (this.shootTimer >= this.shootAt) {
            bullets.push(new Bullet(this.x, this.y, ENEMY.ANGLE, this.projectiles[0], "Enemy"));
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