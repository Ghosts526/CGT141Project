import { Explosion } from "./Explosion.js";

/**
 * This class checks for collision between bullets, enemies, and player.
 */

export class Collision {
    constructor() 
    {
        this.score = 0;
    }

    collisionCheck(bullets, player, enemies, gameOver) 
    {
        for (let i = bullets.length - 1; i >= 0; i--) {
            if (bullets[i].source == "Enemy") { // Enemy bullet
                if (this.overlap(bullets[i], player)) {
                    player.hp -= 1;
                    bullets.splice(i, 1);

                    if (player.hp <= 0)
                    {
                        gameOver();
                    }
                }
            } else if (bullets[i].source == "Player Missile") { // Player Missile
                // Check all enemies collision
                for (let j = enemies.length - 1; j >= 0; j--) {
                    if (this.overlap(bullets[i], enemies[j])) {
                        //bullets[i].explode(); // Creates a explosion area effect
                        bullets.push(new Explosion(bullets[i].x, bullets[i].y, 200, 200, -Math.PI / 2, "images/ExplosionV1.png", "Explosion"));
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
                    player.hp -= 25;

                    if (player.hp <= 0)
                    {
                        gameOver();
                    }
                }
                for (let j = enemies.length - 1; j >= 0; j--) {
                    if (this.overlap(bullets[i], enemies[j])) {
                        enemies[j].hp -= 25;

                        if (enemies[j].hp <= 0) {
                            this.score += enemies[j].score;
                            enemies.splice(j, 1);
                        }
                        break; // Exit enemy loop after bullet is removed
                    }
                }                
            }else { // Player's Bullet
                // Check all enemies collision
                for (let j = enemies.length - 1; j >= 0; j--) {
                    if (this.overlap(bullets[i], enemies[j])) {
                        enemies[j].hp -= 5;
                        bullets.splice(i, 1);

                        if (enemies[j].hp <= 0) {
                            this.score += enemies[j].score;
                            enemies.splice(j, 1);
                        }
                        break; // Exit enemy loop after bullet is removed
                    }
                }
            }
        }
    }

    overlap(objA, objB)
    {
        let A = this.setTrueLengths(objA);
        let B = this.setTrueLengths(objB);

        // Checks the height if out of bounds
        if (A.center.y + A.hh >= B.center.y - B.hh && A.center.y - A.hh <= B.center.y + B.hh) 
        { // Checks the width if out of bounds
            if (A.center.x - A.hw <= B.center.x + B.hw && A.center.x + A.hw >= B.center.x - B.hw)
            {
                return true;
            }
        }
        return false;
    }

    // Due to rotations, if you rotate an obj that isn't a square then its width and height are different when detecting collisions
    // This function gives back the True width and height for a correct collision check
    setTrueLengths(obj)
    {
        if (obj.angle % Math.PI == 0)
        {
            return {
                center: { x: obj.x, y: obj.y },
                hw: obj.width / 2,
                hh: obj.height / 2
            };
        } else {
            return {
                center: { x: obj.x, y: obj.y },
                hw: obj.height / 2,
                hh: obj.width / 2
            };
        }
    }
}