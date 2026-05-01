import { MISSILE, PIXEL_SCALE, SHOW_HIT_BOX } from "./Constants.js";

/**
 * This class handles missile creation, movement, and rendering
 */

export class Missile {
    // A constructor for the missile class
    constructor(x, y, angle, image, source) {
        this.x = x, this.y = y;
        this.angle = angle;
        this.addX = Math.sin(angle) * MISSILE.SPEED, this.addY = -Math.cos(angle) * MISSILE.SPEED;
        this.sprite = image;
        this.source = source; // What object created the missile
    }

    // Updates the missile location based by its angle and speed
    newPos(dt) {
        this.x += this.addX * dt * PIXEL_SCALE;
        this.y += this.addY * dt * PIXEL_SCALE;
    }

    // Draws the missile to its current position and rotation
    update(context) {
        const ctx = context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.drawImage(this.sprite, -MISSILE.WIDTH / 2, -MISSILE.HEIGHT / 2, MISSILE.WIDTH, MISSILE.HEIGHT);

        // Display Hitbox
        if (SHOW_HIT_BOX == "true") {
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.rect(-MISSILE.WIDTH / 2, -MISSILE.HEIGHT / 2, MISSILE.WIDTH, MISSILE.HEIGHT);
            ctx.stroke();
        }

        ctx.restore();
    }
}