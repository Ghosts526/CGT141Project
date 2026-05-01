/**
 * Updates or setup the top score display in the game menu 
 */

function reset() {
    localStorage.setItem("topScore", "0");
    updateDisplay();
}

function updateDisplay() {
    if (localStorage.getItem("topScore") == null) {
        reset();
    }
    document.getElementById("topScore").innerText = "High Score: " + localStorage.getItem("topScore");
}

window.onload = function () { updateDisplay() };
