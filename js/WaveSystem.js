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
            let x = gameArea.canvas.width;
            let y = Math.floor(Math.random() * (gameArea.canvas.height - 60)) + 30;
            let angle = -Math.PI / 2;

            enemies.push(new Enemy(x, y, 60, 60, angle, "images/Spaceship.png", 1)); // Need to add the width, height, and angle
            this.enemiesSpawning--;
            this.timer = 0;
        }
    }
}