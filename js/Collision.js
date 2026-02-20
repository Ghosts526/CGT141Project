/**
 * This class checks for collision between bullets, enemies, and player.
 * 
 * It uses the Separating Axis Theorem (SAT) for collision detection
 * and manages health/damage logic
 */

export class Collision {
    collisionCheck(bullets, enemies, player) 
    {
        for (let i = bullets.length - 1; i >= 0; i--) {
            if (bullets[i].source == "Enemy") { // Enemy bullet
                if (SAT(bullets[i], player)) {
                    player.hp -= 25;
                    bullets.splice(i, 1);

                    if (player.hp <= 0)
                    {
                        gameOver(); // Does it work???
                    }
                }
            } else { // Player's Bullet
                // Check all enemies collision
                for (let j = enemies.length - 1; j >= 0; j--) {
                    if (SAT(bullets[i], enemies[j])) {
                        enemies[j].hp -= 25;
                        bullets.splice(i, 1);

                        if (enemies[j].hp <= 0) {
                            enemies.splice(j, 1);
                        }
                        break; // Exit enemy loop after bullet is removed
                    }
                }
            }
        }
    }

    // Returning true or false when collided
    SAT(objA, objB) // Using Separating Axis Theorem (SAT)
    {
        let A = {
            center: { x: objA.x, y: objA.y },
            hw: objA.width / 2,
            hh: objA.height / 2,
            angle: objA.angle
        };

        let B = {
            center: { x: objB.x, y: objB.y },
            hw: objB.width / 2,
            hh: objB.height / 2,
            angle: objB.angle
        };

        computeAxes(A);
        computeAxes(B);

        const axes = [A.u, A.v, B.u, B.v];

        for (let L of axes) {
            if (!overlapOnAxis(A, B, L)) {
                return false; // No Collision
            }
        }
        return true; // Collision
    }

    // Creates a u and v vector
    computeAxes(rect)
    {
        const c = Math.cos(rect.angle);
        const s = Math.sin(rect.angle);

        rect.u = {x:  c, y: s};
        rect.v = {x: -s, y: c};
    }

    // Returns true if it overlaps and false if it doesn't
    overlapOnAxis(A, B, L)
    {
        const projA = dot(A.center, L);
        const projB = dot(B.center, L);

        const rA = 
            A.hw * Math.abs(dot(A.u, L)) + 
            A.hh * Math.abs(dot(A.v, L));
        
        const rB = 
            B.hw * Math.abs(dot(B.u, L)) + 
            B.hh * Math.abs(dot(B.v, L));

        return (Math.abs(projA - projB) <= (rA + rB));
    }

    // Dot Product
    dot(a, b) 
    {
        return a.x * b.x + a.y * b.y;
    }
}