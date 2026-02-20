import { Enemy } from "./Enemy.js";

/**
 * Manages enemy wave spawing and progression logic
 */

export class WaveSystem {
    constructor() {
        this.restart();
    }

    restart() {
        this.timer = 0;
        this.wave = 0;
        this.enemiesSpawning = 0;
    }

    waves(gameArea, enemies) {
        if (enemies.length == 0 && this.enemiesSpawning == 0)
        {
            this.wave++;
            this.enemiesSpawning = 2 * this.wave + 2;
            this.timer = 0;
        }
        
        this.timer += 1;

        if (this.enemiesSpawning > 0 && this.timer >= 100)
        {
            let x = 0, y = 0, angle = 0;
            let i = Math.floor(Math.random() * 4);

            if (i == 0) {
                x = Math.floor(Math.random() * gameArea.canvas.width);
                y = 0;
                angle = Math.PI;
            } else if (i == 1) {
                x = Math.floor(Math.random() * gameArea.canvas.width);
                y = gameArea.canvas.height;
                angle = 0;
            } else if (i == 2) {
                x = 0;
                y = Math.floor(Math.random() * gameArea.canvas.height);
                angle = Math.PI / 2;
            } else {
                x = gameArea.canvas.width;
                y = Math.floor(Math.random() * gameArea.canvas.height);
                angle = Math.PI / -2
            }

            enemies.push(new Enemy(x, y, 40, 40, angle, "images/Spaceship.png")); // Need to add the width, height, and angle
            this.enemiesSpawning--;
            this.timer = 0;
        }
    }
}