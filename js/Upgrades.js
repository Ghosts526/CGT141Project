function upgrade(buttonNum)
{
    let newCredits = "";
    let newLV = "";
    switch(buttonNum) {
        case 1: // Upgrade Health
            if (purchase(100)) {
                newLV = (parseInt(localStorage.getItem("healthLV"), 10) + 1).toString();
                localStorage.setItem("healthLV", newLV);
            }
            break;
        case 2: // Upgrade Fire Rate
            if (purchase(100)) {
                newLV = (parseInt(localStorage.getItem("fireRateLV"), 10) + 1).toString();
                localStorage.setItem("fireRateLV", newLV);
            }
            break;
        case 3: // Upgrade Missle Cooldown
            if (purchase(100)) {
                newLV = (parseInt(localStorage.getItem("missleCooldownLV"), 10) + 1).toString();
                localStorage.setItem("missleCooldownLV", newLV);
            }
            break;
        case 4: // Upgrade Shield Health
            if (purchase(100)) {
                newLV = (parseInt(localStorage.getItem("shieldHealthLV"), 10) + 1).toString();
                localStorage.setItem("shieldHealthLV", newLV);
            }
            break;
        case 5: // Upgrade Shield Cooldown
            if (purchase(100)) {
                newLV = (parseInt(localStorage.getItem("shieldCooldownLV"), 10) + 1).toString();
                localStorage.setItem("shieldCooldownLV", newLV);
            }
            break;
    }
    updateDisplay();
}

function purchase(cost)
{
    let credits = parseInt(localStorage.getItem("credits"), 10);
    if (credits >= cost)
    {
        let newCredits = (credits - cost).toString();
        localStorage.setItem("credits", newCredits);
        return true;
    }
    return false;
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
