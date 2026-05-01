import { Explosion } from "./Explosion.js";
import { PLAYER, ENEMY, BULLET, MISSILE, EXPLOSION } from "./Constants.js";

/**
 * This class checks for collision between bullets, enemies, and player.
 */

export class Collision {
    constructor() {
        this.score = 0; // Tracks total points earned
    }

    collisionCheck(bullets, player, enemies, gameOver) {
        for (let i = bullets.length - 1; i >= 0; i--) {
            if (bullets[i].source == "Enemy") { // Enemy bullet
                if (this.overlap(bullets[i], player)) {
                    player.damaged(1);
                    bullets.splice(i, 1);

                    if (player.hp <= 0) {
                        gameOver();
                    }
                }
            } else if (bullets[i].source == "Player Missile") { // Player Missile
                // Check all enemies collision
                for (let j = enemies.length - 1; j >= 0; j--) {
                    if (this.overlap(bullets[i], enemies[j])) {
                        bullets.push(new Explosion(bullets[i].x, bullets[i].y, -PLAYER.ANGLE, this.projectiles, "Explosion"));
                        bullets.splice(i, 1);
                        break; // Exit enemy loop after missile explodes
                    }
                }
            } else if (bullets[i].source == "Explosion") { // Explosion caused by a explosive projectile
                if (bullets[i].state >= 4) {
                    bullets.splice(i, 1);
                    break;
                }
                if (this.overlap(bullets[i], player)) {
                    player.damaged(25);

                    if (player.hp <= 0) {
                        gameOver();
                    }
                }
                for (let j = enemies.length - 1; j >= 0; j--) {
                    if (this.overlap(bullets[i], enemies[j])) {
                        enemies[j].damaged(25);

                        if (enemies[j].hp <= 0) {
                            this.score += enemies[j].score;
                            enemies.splice(j, 1);
                        }
                        break; // Exit enemy loop after bullet is removed
                    }
                }
            } else { // Player's Bullet
                // Check all enemies collision
                for (let j = enemies.length - 1; j >= 0; j--) {
                    if (this.overlap(bullets[i], enemies[j])) {
                        enemies[j].damaged(5);
                        bullets.splice(i, 1);

                        if (enemies[j].hp <= 0) {
                            this.score += enemies[j].score;
                        }
                        break; // Exit enemy loop after bullet is removed
                    }
                }
            }
        }
    }

    overlap(objA, objB) {
        let A = this.setTrueLengths(objA);
        let B = this.setTrueLengths(objB);

        // Checks the height if out of bounds
        if (A.center.y + A.hh >= B.center.y - B.hh && A.center.y - A.hh <= B.center.y + B.hh) { // Checks the width if out of bounds
            if (A.center.x - A.hw <= B.center.x + B.hw && A.center.x + A.hw >= B.center.x - B.hw) {
                return true;
            }
        }
        return false;
    }


    // Returns the True width and height based on rotation
    setTrueLengths(obj) {

        const objInfo = this.getObjInfo(obj);

        if (objInfo.angle % Math.PI == 0) { // If the rotations is 0 or 180 degrees
            return {
                center: { x: obj.x, y: obj.y },
                hw: objInfo.width / 2,
                hh: objInfo.height / 2
            };
        } else { // If the rotations is 90 or 270 degrees
            return {
                center: { x: obj.x, y: obj.y },
                hw: objInfo.height / 2,
                hh: objInfo.width / 2
            };
        }
    }

    setProjectiles(projectiles) {
        this.projectiles = projectiles;
    }

    getObjInfo(obj) {
        const name = obj.constructor.name;
        
        switch (name) {
            case "Player":
                return { width: PLAYER.WIDTH * PLAYER.WIDTH_MULTIPLIER, height: PLAYER.HEIGHT, angle: PLAYER.ANGLE };
            case "Enemy":
                return { width: ENEMY.WIDTH * ENEMY.WIDTH_MULTIPLIER, height: ENEMY.HEIGHT, angle: ENEMY.ANGLE };
            case "Bullet":
                return { width: BULLET.WIDTH, height: BULLET.HEIGHT, angle: obj.angle };
            case "Missile":
                return { width: MISSILE.WIDTH, height: MISSILE.HEIGHT, angle: obj.angle };
            case "Explosion":
                return { width: EXPLOSION.WIDTH, height: EXPLOSION.HEIGHT, angle: obj.angle };
            default:
                console.warn(name + " is an unknown class name!");
                return { width: 0, height: 0, angle: 0 };
        }
    }
}