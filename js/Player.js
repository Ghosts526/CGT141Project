import { Bullet } from "./Bullet.js";

/**
 * This class handles the creation, movement, shooting, and rendering 
 */

export class Player {
    constructor(x, y, width, height, image) {
        // Set up variables for the player
        this.restart(x, y);
        this.width = width, this.height = height;
        this.speed = 3;
        this.image = new Image(), this.image.src = image;
    }

    // Restarts the player location
    restart(x, y) {
        this.x = x, this.y = y;
        this.angle = Math.PI/2, this.moveAngle = 0;
        this.moveUp = 0, this.moveDown = 0;
        this.shoot = false;
        this.hp = 100;
        this.fireDelay = 10; // Delay between shooting
        this.fireTimer = 0; // Current time for shooting
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

        ctx.restore();
    }
}