export class PlayerFunction {
    constructor(x, y, width, height, image) {
        // Set up variables for the player
        this.image = new Image();
        this.image.src = image;
        this.width = width;
        this.height = height;
        this.angle = 0;
        this.moveAngle = 0;
        this.moveUp = 0;
        this.moveLeft = 0;
        this.moveRight = 0;
        this.speed = 2;
        this.shoot = false;
        this.hasShot = false;
        this.x = x;
        this.y = y;
        this.hp = 100;
    }

    // Updates the player image to its current position
    update(ctx) {
        ctx = myGameArea.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);

        if (this.shoot && !this.hasShot) {
            this.hasShot = true;
            bullets.push(new Bullet(this.x, this.y, 5, 20, this.angle, "images/Blaster.png", "Player"));
        }
        ctx.restore();
    }

    // Updates the position and angle of the player
    newPos() {
        if (this.moveLeft + this.moveRight != 0 || this.moveUp) {
            this.image.src = "images/SpaceshipMoving.png";
        } else {
            this.image.src = "images/Spaceship.png";
        }
        this.moveAngle = this.moveLeft + this.moveRight;
        this.angle += this.moveAngle * Math.PI / 180 * this.speed * 1.5;
        this.x -= this.moveUp * Math.sin(this.angle) * this.speed;
        this.y += this.moveUp * Math.cos(this.angle) * this.speed;
    }
}