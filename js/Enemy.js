import { Bullet } from "./Bullet.js";

/**
 * This class handles the creation, movement, shooting, and rendering 
 */

export class Enemy
{
    // A constructor for the enemy class
    constructor(x, y, width, height, angle, image)
    {
        this.x = x, this.y = y;
        this.width = width, this.height = height;
        this.angle = angle
        this.speed = 1;
        this.addX = Math.sin(angle) * this.speed, this.addY = -Math.cos(angle) * this.speed;
        this.image = new Image(), this.image.src = image;
        this.shootAt = (Math.floor(Math.random() * 3) + 3) * 20;
        this.shootTimer = 0;
        this.hp = 25;
    }

    // Updates the enemy location based by its angle and speed
    newPos(player)
    {
        this.followPlayer(player);
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

        ctx.restore();
    }

    followPlayer(player)
    {
        
        this.angle = Math.atan2(player.y - this.y, player.x - this.x) + Math.PI / 2;
        this.addX = Math.sin(this.angle) * this.speed;
        this.addY = -Math.cos(this.angle) * this.speed;
    }

    tryShoot(bullets, player)
    {
        this.shootTimer++;
        if (this.shootTimer >= this.shootAt) {
            let accuracy = 45; // +/- 30 accuracy
            let xr = Math.floor(Math.random() * (accuracy * 2 + 1)) - accuracy, yr = Math.floor(Math.random() * (accuracy * 2 + 1)) - accuracy; 
            let newAngle = Math.atan2(player.y - this.y + yr, player.x - this.x + xr) + Math.PI / 2;
            bullets.push(new Bullet(this.x, this.y, 5, 20, newAngle, "images/Blaster.png", "Enemy"));
            this.shootAt = (Math.floor(Math.random() * 3) + 3) * 20; //error
            this.shootTimer = 0;
        }
    }
}