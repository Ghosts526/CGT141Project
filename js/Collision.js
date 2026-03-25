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
            } else { // Player's Bullet
                // Check all enemies collision
                for (let j = enemies.length - 1; j >= 0; j--) {
                    if (this.overlap(bullets[i], enemies[j])) {
                        enemies[j].hp -= 25;
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
        let A = { // Bullet Object
            center: { x: objA.x, y: objA.y },
            hw: objA.width / 2,
            hh: objA.height / 2
        };

        let B = { // Player or Enemy Object
            center: { x: objB.x, y: objB.y },
            hw: objB.width / 2,
            hh: objB.height / 2
        };

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
}