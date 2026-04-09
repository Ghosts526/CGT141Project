import { Bullet } from "./Bullet.js";
import { Missile } from "./Missile.js";

/**
 * This class handles the creation, movement, shooting, and rendering 
 */

export class Player {
    constructor(x, y, width, height, image, widthMultiplyer) {
        // Set up variables for the player
        this.restart(x, y);
        this.width = width, this.height = height;
        this.speed = 7;
        this.image = new Image(), this.image.src = image;
        this.widthMultiplyer = widthMultiplyer;
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
        if (localStorage.getItem("godMode") == "false") {
            this.maxHp = 4 + parseInt(localStorage.getItem("healthLV"));
            this.hp = 4 + parseInt(localStorage.getItem("healthLV"));
        } else {
            this.maxHp = 99999;
            this.hp = 99999;
        }
        this.imageState = 1;
        // Time is using frames which is at 20
        this.fireDelay = 20 * (1.5 - 0.5 * (parseInt(localStorage.getItem("fireRateLV")) - 1)); // (Sec) Delay between shooting
        this.fireTimer = 0; // Current time for shooting
        this.missileDelay = 20 * (10 - (parseInt(localStorage.getItem("missileCooldownLV")) - 1) * 0.3);
        this.missileTimer = 0;
        this.maxShieldHP = parseInt(localStorage.getItem("shieldHealthLV")) - 1;
        this.shieldHP = parseInt(localStorage.getItem("shieldHealthLV")) - 1;
        this.shieldDelay = 20 * (31 - parseInt(localStorage.getItem("shieldCooldownLV")));
        this.shieldTimer = 0;
        this.showBox = localStorage.getItem("showCollisionBox");
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

        this.movingEffect();

        ctx.drawImage(this.image, -this.width / 2 / this.widthMultiplyer, -this.height / 2, this.width / this.widthMultiplyer, this.height);

        // Display Hitbox
        if (this.showBox == "true") {
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
            ctx.stroke();
        }

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
                this.image.src = "../images/SpaceshipV3.2.png";
                break;
            case 10:
                this.image.src = "../images/SpaceshipV3.3.png";
                break;
            case 20:
                this.image.src = "../images/SpaceshipV3.4.png";
                break;
            case 30:
                this.image.src = "../images/SpaceshipV3.5.png";
                break;
            case 40:
                this.image.src = "../images/SpaceshipV3.4.png";
                break;
            case 50:
                this.image.src = "../images/SpaceshipV3.3.png";
                this.imageState = 10;
                break;
        }
        this.imageState++;
    }
}