import { BULLET, PIXEL_SCALE, SHOW_HIT_BOX} from "./Constants.js";

/**
 * This class handles the bullet creation, movement, and rendering
 */
export class Bullet {
    constructor(x, y, angle, image, source) {
        this.x = x, this.y = y;
        this.angle = angle;
        this.addX = Math.sin(angle) * BULLET.SPEED, this.addY = -Math.cos(angle) * BULLET.SPEED;
        this.sprite = image;
        this.source = source; // What object created the bullet
    }

    newPos(dt) {
        this.x += this.addX * dt * PIXEL_SCALE;
        this.y += this.addY * dt * PIXEL_SCALE;
    }

    update(context) {
        const ctx = context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.drawImage(this.sprite, -BULLET.WIDTH / 2, -BULLET.HEIGHT / 2, BULLET.WIDTH, BULLET.HEIGHT);

        // Display Hitbox
        if (SHOW_HIT_BOX == "true") {
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.rect(-BULLET.WIDTH / 2, -BULLET.HEIGHT / 2, BULLET.WIDTH, BULLET.HEIGHT);
            ctx.stroke();
        }

        ctx.restore();
    }
}