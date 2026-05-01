import { EXPLOSION, SHOW_HIT_BOX, PIXEL_SCALE } from "./Constants.js";

/**
 * This class handles explosion creation, movement, and rendering
 */

export class Explosion {
    // A constructor for the explosion class
    constructor(x, y, angle, images, source) {
        this.x = x, this.y = y;
        this.angle = angle
        this.addX = Math.sin(angle) * EXPLOSION.SPEED, this.addY = -Math.cos(angle) * EXPLOSION.SPEED;
        this.images = images, this.sprite = images[2];
        this.source = source; // What object created the explosion
        this.switchImageTimer = 20;// Frames * seconds
        this.timer = 0, this.state = 1;
    }

    // Updates the explosion location based by its angle and speed
    newPos(dt) {
        this.x += this.addX * dt * PIXEL_SCALE;
        this.y += this.addY * dt * PIXEL_SCALE;
    }

    // Draws the explosion to its current position and rotation
    update(context) {
        let ctx = context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.drawImage(this.sprite, -EXPLOSION.WIDTH / 2, -EXPLOSION.HEIGHT / 2, EXPLOSION.WIDTH, EXPLOSION.HEIGHT);

        // Display Hitbox
        if (SHOW_HIT_BOX == "true") {
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.rect(-EXPLOSION.WIDTH / 2, -EXPLOSION.HEIGHT / 2, EXPLOSION.WIDTH, EXPLOSION.HEIGHT);
            ctx.stroke();
        }

        ctx.restore();
        (this.timer >= this.switchImageTimer) ? this.switchImage() : this.timer++;
    }

    switchImage() {
        this.timer = 0;
        this.state++;
        switch (this.state) {
            case 2:
                this.sprite = this.images[3];
                break;
            case 3:
                this.sprite = this.images[4]
                break
        }
    }
}