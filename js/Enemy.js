import { Bullet } from "./Bullet.js";

/**
 * This class handles the creation, movement, shooting, and rendering 
 */

export class Enemy
{
    // A constructor for the enemy class
    constructor(x, y, width, height, angle, image, score)
    {
        this.x = x, this.y = y;
        this.width = width, this.height = height;
        this.angle = angle
        this.speed = 4;
        this.addX = Math.sin(angle) * this.speed, this.addY = -Math.cos(angle) * this.speed;
        this.image = new Image(), this.image.src = image;
        this.shootAt = (Math.floor(Math.random() * 2) + 1) * 20; // 1-2 seconds
        this.shootTimer = 0;
        this.hp = 5;
        this.score = score;
        this.showBox = localStorage.getItem("showCollisionBox");
    }

    // Updates the enemy location based by its angle and speed
    newPos()
    {
        this.x += this.addX, this.y += this.addY;
        if (this.addX != 0 || this.addY != 0)
        {
            this.image.src = "images/SpaceshipMoving.png";
        } else {
            this.image.src = "image/Spaceship.png";
        }
    }

    // Draws the enemy to its current position and rotation
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
    }

    tryShoot(bullets)
    {
        this.shootTimer++;
        if (this.shootTimer >= this.shootAt) {
            bullets.push(new Bullet(this.x, this.y, 5, 20, this.angle, "images/Blaster.png", "Enemy"));
            this.shootAt = (Math.floor(Math.random() * 2) + 2) * 20; // 2-3 seconds
            this.shootTimer = 0;
        }
    }

    damaged(amount)
    {
        this.hp -= amount;
    }
}