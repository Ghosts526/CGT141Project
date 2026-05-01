// A file with pre-define variables for the game

export const PIXEL_SCALE = 50;
export const SHOW_HIT_BOX = localStorage.getItem("showCollisionBox") || "false";

export const GAME_SIZE = {
    WIDTH: 1200,
    HEIGHT: 675,
};

export const PLAYER = {
    SPEED: 7,
    WIDTH: 60, HEIGHT: 60, WIDTH_MULTIPLIER: 0.4, // W_M is only for collisions
    ANGLE: Math.PI / 2,
    START_X: 130, START_Y: GAME_SIZE.HEIGHT / 2,

    MAX_HP: 4 + parseInt(localStorage.getItem("healthLV") || 1),

    FIRE_DELAY: 1.5 * (0.92 ** (parseInt(localStorage.getItem("fireRateLV") || 1) - 1)),
    MISSILE_DELAY: 10 * (0.95 ** (parseInt(localStorage.getItem("missileCooldownLV") || 1) - 1)),

    MAX_SHIELD: (parseInt(localStorage.getItem("shieldHealthLV") || 1) - 1) * 0.5,
    SHIELD_DELAY: 30 * (0.96 ** (parseInt(localStorage.getItem("shieldCooldownLV") || 1) - 1))
};

export const ENEMY = {
    SPEED: 4,
    WIDTH: 70, HEIGHT: 70, WIDTH_MULTIPLIER: 0.8,
    ANGLE: -Math.PI/2,
    START_X: 1200,
    
    MAX_HP: 5,

    MIN_Y: 30,
    MAX_Y: GAME_SIZE.HEIGHT - 30
};

export const BULLET = {
    SPEED: 25,
    WIDTH: 5, HEIGHT: 20
};

export const MISSILE = {
    SPEED: 20,
    WIDTH: 15, HEIGHT: 60
};

export const EXPLOSION = {
    SPEED: 5,
    WIDTH: 200, HEIGHT: 200
};

export const UP_BUTTON = { 
    x: 10, y: 380, 
    width: 100, height: 100 
};

export const DOWN_BUTTON = { 
    x: 10, y: 500, 
    width: 100, height: 100 
};

export const FIRE_BUTTON = { 
    x: 1090, y: 380, 
    width: 100, height: 100 
};

export const MISSILE_BUTTON = { 
    x: 1090, y: 500, 
    width: 100, height: 100 
};

export const PAUSE_BUTTON = { 
    x: 1090, y: 10, 
    width: 100, height: 100 
};