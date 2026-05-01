import { Bullet } from "./Bullet.js";
import { Missile } from "./Missile.js";
import { Sound } from "./Sound.js";
import { PLAYER, PIXEL_SCALE, SHOW_HIT_BOX} from "./Constants.js";
import { AUDIO_SRC } from "./Assets.js";

/**
 * This class handles the creation, movement, shooting, and rendering of the player
 */

export class Player {
    constructor(images, projectiles) {
        // Set up variables for the player
        this.restart();
        this.images = images, this.sprite = images[0], this.projectiles = projectiles;
        this.shootSound = new Sound(AUDIO_SRC.SHOOT, false, 0, 5, .75);
        this.missileSound = new Sound(AUDIO_SRC.MISSILE, false, 0.15, 1, 1);
    }
    
    // Restarts the player location
    restart() {
        this.x = PLAYER.START_X, this.y = PLAYER.START_Y;
        this.moveUp = false, this.moveDown = false;
        this.moveUpTouch = false, this.moveDownTouch = false;
        this.shoot = false, this.shootMissile = false;
        this.shootTouch = false, this.shootMissileTouch = false;
        this.missileReady = true;
        if (localStorage.getItem("godMode") == "false") {
            this.maxHp = PLAYER.MAX_HP;
        } else {
            this.maxHp = 1_000_000;
        }
        this.hp = this.maxHp;
        this.imageState = 1;
        this.fireTimer = 0; // Current time for shooting
        this.missileTimer = 0;
        this.shieldHP = PLAYER.MAX_SHIELD;
        PLAYER.SHIELD_DELAY = PLAYER.SHIELD_DELAY;
        this.shieldTimer = 0;
        this.showBox = SHOW_HIT_BOX;
        this.isShieldRegen = false;
        this.destroyed = false;
    }

    // Updates the position and angle of the player
    newPos(dt) {
        const movement = (this.moveDown || this.moveDownTouch) - (this.moveUp || this.moveUpTouch);
        this.y += movement * PLAYER.SPEED * dt * PIXEL_SCALE;
    }

    // Updates the player image to its current position
    update(context, bullets, dt) {
        const ctx = context;
        ctx.save();

        ctx.translate(this.x, this.y);
        ctx.rotate(PLAYER.ANGLE);

        this.movingEffect();

        ctx.drawImage(this.sprite, -PLAYER.WIDTH / 2, -PLAYER.HEIGHT / 2, PLAYER.WIDTH, PLAYER.HEIGHT);

        // Display Hitbox
        if (this.showBox == "true") {
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.rect(-PLAYER.WIDTH / 2 * PLAYER.WIDTH_MULTIPLIER, -PLAYER.HEIGHT / 2, PLAYER.WIDTH * PLAYER.WIDTH_MULTIPLIER, PLAYER.HEIGHT);
            ctx.stroke();
        }

        if ((this.shoot || this.shootTouch) && this.fireTimer == 0) {
            this.fireTimer += dt;
            bullets.push(new Bullet(this.x, this.y, PLAYER.ANGLE, this.projectiles[0], "Player"));
            this.shootSound.play();
        } else if (this.fireTimer >= PLAYER.FIRE_DELAY) {
            this.fireTimer = 0;
        } else if ((this.shoot || this.shootTouch) || (!(this.shoot || this.shootTouch) && this.fireTimer != 0)) {
            this.fireTimer += dt;
        }

        if ((this.shootMissile || this.shootMissileTouch) && this.missileReady) {
            this.missileReady = false;
            bullets.push(new Missile(this.x, this.y, PLAYER.ANGLE, this.projectiles[1], "Player Missile"));
            this.missileSound.play();
        } else if (this.missileTimer >= PLAYER.MISSILE_DELAY) {
            this.missileTimer = 0;
            this.missileReady = true;
        } else if (!this.missileReady && this.missileTimer < PLAYER.MISSILE_DELAY) {
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
            if (this.shieldTimer >= PLAYER.SHIELD_DELAY) {
                this.shieldHP = this.maxShieldHP;
                this.isShieldRegen = false;
                this.shieldTimer = 0;
            }
        }
    }
}