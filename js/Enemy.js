import { Bullet } from "./Bullet.js";

/**
 * This class handles the creation, movement, shooting, and rendering 
 */

export class Enemy
{
    // A constructor for the enemy class
    constructor(x, y, width, height, angle, image, score, widthMultiplier)
    {
        this.x = x, this.y = y;
        this.width = width, this.height = height;
        this.angle = angle
        this.speed = 4;
        this.addX = Math.sin(angle) * this.speed, this.addY = -Math.cos(angle) * this.speed;
        this.image = new Image(), this.image.src = image + ".1.png";
        this.sprite = image;
        this.shootAt = (Math.floor(Math.random() * 2) + 1) * 20; // 1-2 seconds
        this.shootTimer = 0;
        this.hp = 5;
        this.score = score;
        this.showBox = localStorage.getItem("showCollisionBox");
        this.widthMultiplier = widthMultiplier;
        this.imageState = 1;
    }

    // Updates the enemy location based by its angle and speed
    newPos()
    {
        this.x += this.addX, this.y += this.addY;
    }

    // Draws the enemy to its current position and rotation
    update(context) 
    {
        let ctx = context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        this.movingEffect();

        ctx.drawImage(this.image, -this.width/2 / this.widthMultiplier, -this.height/2, this.width / this.widthMultiplier, this.height);

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

    movingEffect()
    {
        switch (this.imageState) {
            case 1:
                this.image.src = this.sprite + ".2.png";
                break;
            case 10:
                this.image.src = this.sprite + ".3.png";
                break;
            case 20:
                this.image.src = this.sprite + ".4.png";
                break;
            case 30:
                this.image.src = this.sprite + ".5.png";
                break;
            case 40:
                this.image.src = this.sprite + ".4.png";
                break;
            case 50:
                this.image.src = this.sprite + ".3.png";
                this.imageState = 10;
                break;
        }
        this.imageState++;
    }
}