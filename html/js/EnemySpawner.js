import { Enemy } from "./Enemy.js";

/**
 * Manages enemies spawn system and progression logic
 */

export class EnemySpawner {
    constructor() {
        this.restart();
    }

    restart() {
        this.timer = 0;
        this.wave = 0;
        this.enemiesSpawning = 0;
    }

    // Used by GameArea.js
    waves(gameArea, enemies, dt) {
        if (enemies.length == 0 && this.enemiesSpawning == 0) {
            this.wave++;
            this.enemiesSpawning = 2 * this.wave + 2;
            this.timer = 0;
        }

        this.timer += dt;

        if (this.enemiesSpawning > 0 && this.timer >= 1.5) {
            let x = 1200;
            let y = Math.floor(Math.random() * (gameArea.canvas.height - 60)) + 30;
            let angle = -Math.PI / 2;
            let widthMultiplyer = 0.8; 

            enemies.push(new Enemy(x, y, 70 * widthMultiplyer, 70, angle, this.enemyImgs, 1, widthMultiplyer, gameArea, this.projectileImgs));
            this.enemiesSpawning--;
            this.timer = 0;
        }
    }

    setImages(enemyImgs, projectileImgs) {
        this.enemyImgs = enemyImgs; 
        this.projectileImgs = projectileImgs;
    }
}