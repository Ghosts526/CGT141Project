function upgrade(buttonNum)
{
    switch(buttonNum) {
        case 1:
            let newCredits = (parseInt(localStorage.getItem("credits"), 10) - 100).toString();
            localStorage.setItem("credits", newCredits);
            break;
        case 2:
            break;
        case 3:
            break;
        case 4:
            break;
        case 5:
            break;
        default:
            console.log("Default");
            break;
    }
    updateDisplay();
}

function money()
{
    localStorage.setItem("credits", "99999");
    updateDisplay();
}

function reset()
{
    localStorage.setItem("credits", "0");
    updateDisplay();    
}

function updateDisplay()
{
    if (localStorage.getItem("credits") == null) 
    {
        reset();
    }
    document.getElementById("creditsDisplay").innerText = "Credits: " + localStorage.getItem("credits");
}

window.onload = function(){updateDisplay()};
