import { Bullet } from "./Bullet.js";
import { Missile } from "./Missile.js";
import { Sound } from "./Sound.js";

/**
 * This class handles the creation, movement, shooting, and rendering of the player
 */

export class Player {
    constructor(x, y, width, height, images, widthMultiplier, projectiles) {
        // Set up variables for the player
        this.restart(x, y);
        this.width = width, this.height = height;
        this.speed = 7;
        this.widthMultiplier = widthMultiplier;
        this.images = images, this.sprite = images[0], this.projectiles = projectiles, this.pixelScale = 50;
        this.shootSound = new Sound("audio/lazerSoundEffect.mp3", false, 0, 5, .75);
        this.missileSound = new Sound("audio/missileSoundEffect.mp3", false, 0.15, 1, 1);
    }
    
    // Restarts the player location
    restart(x, y) {
        this.x = x, this.y = y;
        this.angle = Math.PI / 2, this.moveAngle = 0;
        this.moveUp = false, this.moveDown = false;
        this.moveUpTouch = false, this.moveDownTouch = false;
        this.shoot = false, this.shootMissile = false;
        this.shootTouch = false, this.shootMissileTouch = false;
        this.missileReady = true;
        if (localStorage.getItem("godMode") == "false") {
            this.maxHp = 4 + parseInt(localStorage.getItem("healthLV"));
            this.hp = this.maxHp;
        } else {
            this.maxHp = 99999;
            this.hp = this.maxHp;
        }
        this.imageState = 1;
        this.fireDelay = 1.5 * (0.92 ** (parseInt(localStorage.getItem("fireRateLV")) - 1)); // (Sec) Delay between shooting
        this.fireTimer = 0; // Current time for shooting
        this.missileDelay = 10 * (0.95 ** (parseInt(localStorage.getItem("missileCooldownLV")) - 1));
        this.missileTimer = 0;
        this.maxShieldHP = (parseInt(localStorage.getItem("shieldHealthLV")) - 1) * 0.5;
        this.shieldHP = this.maxShieldHP;
        this.shieldDelay = 30 * (0.96 ** (parseInt(localStorage.getItem("shieldCooldownLV")) - 1));
        this.shieldTimer = 0;
        this.showBox = localStorage.getItem("showCollisionBox");
        this.isShieldRegen = false;
        this.destroyed = false;
    }

    // Updates the position and angle of the player
    newPos(dt) {
        const movement = (this.moveDown || this.moveDownTouch) - (this.moveUp || this.moveUpTouch);
        this.y += movement * this.speed * dt * this.pixelScale;
    }

    // Updates the player image to its current position
    update(context, bullets, dt) {
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

        if ((this.shoot || this.shootTouch) && this.fireTimer == 0) {
            this.fireTimer += dt;
            bullets.push(new Bullet(this.x, this.y, 5, 20, this.angle, this.projectiles[0], "Player"));
            this.shootSound.play();
        } else if (this.fireTimer >= this.fireDelay) {
            this.fireTimer = 0;
        } else if ((this.shoot || this.shootTouch) || (!(this.shoot || this.shootTouch) && this.fireTimer != 0)) {
            this.fireTimer += dt;
        }

        if ((this.shootMissile || this.shootMissileTouch) && this.missileReady) {
            this.missileReady = false;
            bullets.push(new Missile(this.x, this.y, 5, 20, this.angle, this.projectiles[1], "Player Missile"));
            this.missileSound.play();
        } else if (this.missileTimer >= this.missileDelay) {
            this.missileTimer = 0;
            this.missileReady = true;
        } else if (!this.missileReady && this.missileTimer < this.missileDelay) {
            this.missileTimer += dt;
        }

        this.shieldRegen(dt);

        ctx.restore();
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
                    this.destroyed = true
                } else {
                    this.imageState = 10;
                }
                break;
        }
        this.imageState++;
    }

    damaged(amount) {
        this.sprite = this.images[5];
        this.imageState = 51;
        if (this.shieldHP > 0 && amount <= this.shieldHP) {
            this.shieldHP -= amount;
        } else if (this.shieldHP > 0 && amount > this.shieldHP) {
            amount -= this.shieldHP;
            this.shieldHP = 0;
            this.hp -= amount;
        } else {
            this.hp -= amount;
        }

        if (this.isShieldRegen) {
            this.shieldTimer = 0;
        } else if (this.shieldHP == 0 && this.maxShieldHP != 0) {
            this.isShieldRegen = true;
        }
    }

    shieldRegen(dt) {
        if (this.isShieldRegen) {
            this.shieldTimer += dt;
            if (this.shieldTimer >= this.shieldDelay) {
                this.shieldHP = this.maxShieldHP;
                this.isShieldRegen = false;
                this.shieldTimer = 0;
            }
        }
    }
}