import { Bullet } from "./Bullet.js";
import { Missile } from "./Missile.js";

/**
 * This class handles the creation, movement, shooting, and rendering 
 */

export class Player {
    constructor(x, y, width, height, image) {
        // Set up variables for the player
        this.restart(x, y);
        this.width = width, this.height = height;
        this.speed = 7;
        this.image = new Image(), this.image.src = image;
    }
    // const names = ["topScore", "credits", "healthLV", "fireRateLV", "missileCooldownLV", "shieldHealthLV", "shieldCooldownLV"];
    // Restarts the player location
    restart(x, y) {
        this.x = x, this.y = y;
        this.angle = Math.PI/2, this.moveAngle = 0;
        this.moveUp = 0, this.moveDown = 0;
        this.shoot = false;
        this.shootMissile = false;
        this.missileReady = true;
        this.maxHp = 4 + parseInt(localStorage.getItem("healthLV"));
        this.hp = 4 + parseInt(localStorage.getItem("healthLV"));
        this.imageState = 1;
        // Time is using frames which is at 20
        this.fireDelay = 20 * (1.5 - 0.5 * (parseInt(localStorage.getItem("fireRateLV")) - 1)); // (Sec) Delay between shooting
        this.fireTimer = 0; // Current time for shooting
        this.missileDelay = 20 * (10 - (parseInt(localStorage.getItem("missileCooldownLV")) - 1) * 0.3);
        this.missileTimer = 0;
        this.shieldHP = parseInt(localStorage.getItem("shieldHealthLV")) - 1;
        this.shieldDelay = 20 * (31 - parseInt(localStorage.getItem("shieldCooldownLV")));
        this.shieldTimer = 0;
    }

    // Updates the position and angle of the player
    newPos() {
        this.y += (this.moveUp + this.moveDown) * this.speed;
    }

    // Updates the player image to its current position
    update(context, bullets) {
        let ctx = context;
        ctx.save();

        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);

        if (this.shoot && this.fireTimer == 0) {
            this.fireTimer++;
            bullets.push(new Bullet(this.x, this.y, 5, 20, this.angle, "images/Blaster.png", "Player"));
        } else if (this.shoot && this.fireTimer >= this.fireDelay) {
            this.fireTimer = 0;
        } else if (this.shoot || (!this.shoot && this.fireTimer != 0)) {
            this.fireTimer++;
        } 

        if (this.shootMissile && this.missileReady)
        {
            this.missileReady = false;
            bullets.push(new Missile(this.x, this.y, 5, 20, this.angle, "images/MissileProjectile.png", "Player Missile"));
        } else if (this.missileTimer >= this.missileDelay) {
            this.missileTimer = 0;
            this.missileReady = true;
        } else if (!this.missileReady && this.missileTimer < this.missileDelay) {
            this.missileTimer++;
        }

        ctx.restore();
    }

    movingEffect()
    {
        switch (this.imageState) {
            case 1:

                break;
            case 2:

                break;
            case 3:

                break;
            case 4:

                break;
            default:
                this.imageState = 1;
                break;
        }
    }
}