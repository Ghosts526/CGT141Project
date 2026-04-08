// A missile class to create missile projectiles

/**
 * This class handles bullet creation, movement, and rendering
 */

export class Missile 
{
    // A constructor for the bullet class
    constructor(x, y, width, height, angle, image, source)
    {
        this.x = x, this.y = y;
        this.width = width * 3, this.height = height * 3;
        this.angle = angle
        this.speed = 15;
        this.addX = Math.sin(angle) * this.speed, this.addY = -Math.cos(angle) * this.speed;
        this.image = new Image(), this.image.src = image;
        this.source = source; // What object created the missile
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

        ctx.restore();
    }
}