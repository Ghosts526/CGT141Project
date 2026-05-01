/**
 * This class handles the bullet creation, movement, and rendering
 */
export class Bullet {
    constructor(x, y, width, height, angle, image, source) {
        this.x = x, this.y = y;
        this.width = width, this.height = height, this.angle = angle
        this.speed = 25, this.pixelScale = 50;
        this.addX = Math.sin(angle) * this.speed, this.addY = -Math.cos(angle) * this.speed;
        this.sprite = image;
        this.source = source; // What object created the bullet
        this.showBox = localStorage.getItem("showCollisionBox");
    }

    newPos(dt) {
        this.x += this.addX * dt * this.pixelScale;
        this.y += this.addY * dt * this.pixelScale;
    }

    update(context) {
        const ctx = context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.drawImage(this.sprite, -this.width / 2, -this.height / 2, this.width, this.height);

        // Display Hitbox
        if (this.showBox == "true") {
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
            ctx.stroke();
        }

        ctx.restore();
    }
}