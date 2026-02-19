export class GameArea {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
    }

    start() {
        this.canvas.width = 980;
        this.canvas.height = 600;
        startx = this.canvas.width/2;
        starty = this.canvas.height/2;
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);

        window.addEventListener('keydown', function(e) {
            if (e.key === 'w') player.moveUp = -1;
            if (e.key === 'a') player.moveLeft = -1;
            if (e.key === 'd') player.moveRight = 1;
            if (e.key === ' ') {
                e.preventDefault();
                player.shoot = true;
            }
        })

        window.addEventListener('keyup', function(e) {
            if (e.key === 'w') player.moveUp = 0;
            if (e.key === 'a') player.moveLeft = 0;
            if (e.key === 'd') player.moveRight = 0;
            if (e.key === ' ') {
                player.shoot = false;
                player.fireTimer = 0;
            }
        })
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}