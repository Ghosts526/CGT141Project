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

        if (this.enemiesSpawning > 0 && this.timer >= 20 * 2)
        {
            let x = gameArea.canvas.width;
            let y = Math.floor(Math.random() * (gameArea.canvas.height - 60)) + 30;
            let angle = -Math.PI / 2;
            let widthMultiplyer = 0.8;

            enemies.push(new Enemy(x, y, 70 * widthMultiplyer, 70, angle, "images/EnemySpaceshipV1", 1, widthMultiplyer)); // Need to add the width, height, and angle
            this.enemiesSpawning--;
            this.timer = 0;
        }
    }
}