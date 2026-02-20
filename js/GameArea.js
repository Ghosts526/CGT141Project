import { Collision } from "./Collision.js";

export class GameArea {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
        this.collision = new Collision();
    }

    start(player, enemies, bullets, pause) {
        this.canvas.width = 980;
        this.canvas.height = 600;
        this.startX = this.canvas.width/2;
        this.startY = this.canvas.height/2;
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(this.updateGameArea(pause, bullets, player, enemies), 20);

        window.addEventListener('keydown', function(e) {
            if (e.key === 'w') player.moveUp = -1;
            if (e.key === 'a') player.moveLeft = -1;
            if (e.key === 'd') player.moveRight = 1;
            if (e.key === ' ') {
                e.preventDefault();
                player.shoot = true;
            }
        })

        window.addEventListener('keyup', function(e) {
            if (e.key === 'w') player.moveUp = 0;
            if (e.key === 'a') player.moveLeft = 0;
            if (e.key === 'd') player.moveRight = 0;
            if (e.key === ' ') {
                player.shoot = false;
                player.fireTimer = 0;
            }
        })
    }

    clearGameArea() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    updateGameArea(pause, bullets, player, enemies)
    {
        if (pause == true)
        {
            return;
        }

        this.clearGameArea;

        for (let i = bullets.length - 1; i >= 0; i--) {
            bullets[i].newPos();
            bullets[i].update(this.context);

            // Remove if off-screen
            if (bullets[i].x < 0 || bullets[i].x > this.canvas.width || bullets[i].y < 0 || bullets[i].y > this.canvas.height) 
            {
                bullets.splice(i, 1);
            }
        }

        player.newPos();
        player.update(this.context, bullets);

        waveSystem.waves(this.context, enemies);

        for (let i = enemies.length - 1; i >= 0; i--) {
            enemies[i].newPos(player);
            enemies[i].update(this.context, bullets);
            enemies[i].tryShoot(bullets, player);
        }

        this.collision.collisionCheck();
    }
}