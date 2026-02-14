function mainMenu()
{
    window.location.href = 'index.html';
}

/* Creating Objects + Canvas Basic
context.fillStyle = "red";
context.fillRect(100, 50, 20, 20);

context.beginPath();
context.strokeStyle = "blue";
context.lineWidth = 20;
context.arc(100, 100, 50, 0, Math.PI * 2, false);
context.stroke();
context.closePath(); */

/* Creating classes and object circles dynamic */
/* Fonts and Text in Canvas and Objects */ /*
class Circle 
{
    constructor(xpos, ypos, radius, color, text)
    {
        this.xpos = xpos;
        this.ypos = ypos;
        this.radius = radius;
        this.color = color;
        this.text = text;
    }

    draw(context)
    {
        context.beginPath();

        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        //context.fillText(this.text, this.xpos , this.ypos);
        context.strokeText(this.text, this.xpos, this.ypos);

        context.lineWidth = 5;
        context.arc(this.xpos, this.ypos, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }
}

let circle_counter = 1;

let all_circle = [];

let createCircle = function(circle)
{
    circle.draw(context);
}

for (var numbers = 0; numbers < 10; numbers++)
{
    let random_x = Math.random() * 300
    let random_y = Math.random() * 125;

    let my_circle = new Circle(random_x, random_y, 10, "red", circle_counter);
    all_circle.push(my_circle);
    createCircle(all_circle[numbers])
    circle_counter++;
}

console.log(all_circle);
*/

var myGamePiece;

function startGame()
{
    myGameArea.start();
    myGamePiece = new component(30, 30, "red", 10, 10);
}

var myGameArea = {
    canvas : document.getElementById("gameScreen"),
    start : function() {
        this.canvas.width = 650;
        this.canvas.height = 400;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function(e) {
            if (e.key === 'w') myGamePiece.speedUp = -1;
            if (e.key === 's') myGamePiece.speedDown = 1;
            if (e.key === 'a') myGamePiece.speedLeft = -1
            if (e.key === 'd') myGamePiece.speedRight = 1;
        })
        window.addEventListener('keyup', function(e) {
            if (e.key === 'w') myGamePiece.speedUp = 0;
            if (e.key === 's') myGamePiece.speedDown = 0;
            if (e.key === 'a') myGamePiece.speedLeft = 0;
            if (e.key === 'd') myGamePiece.speedRight = 0;
        })
    }, 
    clear : function()
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y) 
{
    this.width = width;
    this.height = height;
    this.speedUp = 0;
    this.speedDown = 0;
    this.speedLeft = 0;
    this.speedRight = 0;
    this.x = x;
    this.y = y;
    this.update = function() 
    {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function()
    {
        this.x += this.speedLeft + this.speedRight;
        this.y += this.speedUp + this.speedDown;
    }
}

function updateGameArea()
{
    myGameArea.clear();
    myGamePiece.newPos();
    myGamePiece.update();
}