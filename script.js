function playGame()
{
    window.location.href = "game.html";
    const myCanvas = document.getElementById('myCanvas').innerHTML;
    const ctx = myCanvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(20, 20);
    ctx.lineTo(20, 100);
    ctx.lineTo(70, 100);
    ctx.strokeStyle = 'red';
    ctx.stroke();
}

function upgrade()
{
    window.location.href = "upgrade.html"
}

function howToPlay()
{
    window.location.href = "howToPlay.html"
}

function leaderBoard()
{
    window.location.href = "leaderBoard.html"
}

function credits()
{
    window.location.href = "credits.html"
}

function mainMenu()
{
    window.location.href = 'index.html';
}

const k = document.getElementById("k");

// Let k listen for keydown
k.addEventListener("keydown", function (event) {
    
});

function draw()
{
    const myCanvas = document.getElementById('myCanvas');
    const ctx = myCanvas.getContext('2d');
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(20, 20);
    ctx.lineTo(100, 100);
    ctx.lineTo(70, 100);
    ctx.stroke();
}