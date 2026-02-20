import { Enemy } from "./Enemy.js";

export class WaveSystem {
    constructor() {
        this.timer = 0;
        this.wave = 0;
        this.enemiesSpawning = 0;
    }

    waves(gameArea, enemies)
    {
        if (enemies.length == 0 && enemiesSpawning == 0)
        {
            wave++;
            enemiesSpawning = 2 * wave + 2;
            timer = 0;
        }
        
        timer += 1;

        if (enemiesSpawning > 0 && timer >= 100)
        {
            let x = 0, y = 0, angle = 0;
            let i = Math.floor(Math.random() * 4);

            if (i == 0) {
                x = this.getX();
                y = 0;
                angle = Math.PI;
            } else if (i == 1) {
                x = this.getX();
                y = gameArea.canvas.height;
                angle = 0;
            } else if (i == 2) {
                x = 0;
                y = this.getY();
                angle = Math.PI / 2;
            } else {
                x = gameArea.canvas.width;
                y = this.getY();
                angle = Math.PI / -2
            }

            enemies.push(new Enemy(x, y, 40, 40, angle, "images/Spaceship.png")); // Need to add the width, height, and angle
            enemiesSpawning--;
            timer = 0;
        }
    }

    getX()
    {
        return Math.floor(Math.random() * gameArea.canvas.width);
    }

    getY()
    {
        return Math.floor(Math.random() * gameArea.canvas.height);
    }
}