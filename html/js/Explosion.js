/**
 * This class handles explosion creation, movement, and rendering
 */

export class Explosion {
    // A constructor for the explosion class
    constructor(x, y, width, height, angle, images, source) {
        this.x = x, this.y = y;
        this.width = width, this.height = height;
        this.angle = angle, this.speed = 5;
        this.pixelScale = 50;
        this.addX = Math.sin(angle) * this.speed, this.addY = -Math.cos(angle) * this.speed;
        this.images = images, this.sprite = images[2];
        this.source = source; // What object created the explosion
        this.switchImageTimer = 20;// Frames * seconds
        this.timer = 0, this.state = 1;
        this.showBox = localStorage.getItem("showCollisionBox");
    }

    // Updates the explosion location based by its angle and speed
    newPos(dt) {
        this.x += this.addX * dt * this.pixelScale;
        this.y += this.addY * dt * this.pixelScale;
    }

    // Draws the explosion to its current position and rotation
    update(context) {
        let ctx = context;
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