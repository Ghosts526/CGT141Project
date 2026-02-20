import { Bullet } from "./Bullet.js";

/**
 * This class handles the creation, movement, shooting, and rendering 
 */

export class Player {
    constructor(x, y, width, height, image) {
        // Set up variables for the player
        this.x = x, this.y = y;
        this.width = width, this.height = height;
        this.angle = 0, this.moveAngle = 0;
        this.moveUp = 0, this.turnLeft = 0, this.turnRight = 0;
        this.speed = 3;
        this.image = new Image(), this.image.src = image;
        this.shoot = false;
        this.hp = 100;
        this.fireDelay = 10; // Delay between shooting
        this.fireTimer = 0; // Current time for shooting
    }

    // Updates the position and angle of the player
    newPos() {
        if (this.turnLeft + this.turnRight != 0 || this.moveUp) {
            this.image.src = "images/SpaceshipMoving.png";
        } else {
            this.image.src = "images/Spaceship.png";
        }
        this.moveAngle = this.turnLeft + this.turnRight;
        this.angle += this.moveAngle * Math.PI / 180 * this.speed * 1.5;
        this.x -= this.moveUp * Math.sin(this.angle) * this.speed;
        this.y += this.moveUp * Math.cos(this.angle) * this.speed;
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