// A missile class to create missile projectiles

/**
 * This class handles bullet creation, movement, and rendering
 */

export class Explosion 
{
    // A constructor for the bullet class
    constructor(x, y, width, height, angle, image, source)
    {
        this.x = x, this.y = y;
        this.width = width, this.height = height;
        this.angle = angle
        this.speed = 3;
        this.addX = Math.sin(angle) * this.speed, this.addY = -Math.cos(angle) * this.speed;
        this.image = new Image(), this.image.src = image;
        this.source = source; // What object created the explosion
        this.switchImageTimer = 20 * 1.5; // Frames * seconds
        this.timer = 0;
        this.state = 1;
        this.showBox = localStorage.getItem("showCollisionBox");
    }

    // Updates the missile location based by its angle and speed
    newPos()
    {
        this.x += this.addX;
        this.y += this.addY;
    }

    // Draws the missile to its current position and rotation
    update(context) 
    {
        let ctx = context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.drawImage(this.image, -this.width/2, -this.height/2, this.width, this.height);

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

    switchImage()
    {
        this.timer = 0;
        this.state++;
        switch (this.state) {
            case 2:
                this.image.src = "../images/ExplosionV2.png";
                break;
            case 3:
                this.image.src = "../images/ExplosionV3.png";
                break
        }
    }
}