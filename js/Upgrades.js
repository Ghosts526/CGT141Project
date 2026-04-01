function upgrade(buttonNum)
{
    let newCredits = "";
    let newLV = "";
    switch(buttonNum) {
        case 1: // Upgrade Health
            newCredits = (parseInt(localStorage.getItem("credits"), 10) - 100).toString();
            localStorage.setItem("credits", newCredits);
            newLV = (parseInt(localStorage.getItem("healthLV"), 10) + 1).toString();
            localStorage.setItem("healthLV", newLV);
            break;
        case 2: // Upgrade Fire Rate
            newCredits = (parseInt(localStorage.getItem("credits"), 10) - 100).toString();
            localStorage.setItem("credits", newCredits);
            newLV = (parseInt(localStorage.getItem("fireRateLV"), 10) + 1).toString();
            localStorage.setItem("fireRateLV", newLV);
            break;
        case 3: // Upgrade Missle Cooldown
            newCredits = (parseInt(localStorage.getItem("credits"), 10) - 100).toString();
            localStorage.setItem("credits", newCredits);
            newLV = (parseInt(localStorage.getItem("missleCooldownLV"), 10) + 1).toString();
            localStorage.setItem("missleCooldownLV", newLV);
            break;
        case 4: // Upgrade Shield Health
            newCredits = (parseInt(localStorage.getItem("credits"), 10) - 100).toString();
            localStorage.setItem("credits", newCredits);
            newLV = (parseInt(localStorage.getItem("shieldHealthLV"), 10) + 1).toString();
            localStorage.setItem("shieldHealthLV", newLV);
            break;
        case 5: // Upgrade Shield Cooldown
            newCredits = (parseInt(localStorage.getItem("credits"), 10) - 100).toString();
            localStorage.setItem("credits", newCredits);
            newLV = (parseInt(localStorage.getItem("shieldCooldownLV"), 10) + 1).toString();
            localStorage.setItem("shieldCooldownLV", newLV);
            break;
    }
    updateDisplay();
}

function money()
{
    localStorage.setItem("credits", "99999");
    updateDisplay();
    console.log("Added 99999 Credits")
}

function updateDisplay()
{
    document.getElementById("creditsDisplay").innerText = "Credits: " + localStorage.getItem("credits");
}

window.onload = function(){updateDisplay()};
