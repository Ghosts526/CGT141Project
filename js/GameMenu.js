function reset()
{
    localStorage.setItem("topScore", "0");
    updateDisplay();    
}

function updateDisplay()
{
    if (localStorage.getItem("topScore") == null) 
    {
        reset();
    }
    document.getElementById("topScore").innerText = "Score: " + localStorage.getItem("topScore");
}

window.onload = function(){updateDisplay()};
