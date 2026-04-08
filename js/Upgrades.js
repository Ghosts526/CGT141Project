function upgrade(buttonNum)
{
    let newCredits = "";
    let newLV = "";
    switch(buttonNum) {
        case 1: // Upgrade Health
            if (purchase(50 * parseInt(localStorage.getItem("healthLV")))) {
                newLV = (parseInt(localStorage.getItem("healthLV"), 10) + 1).toString();
                localStorage.setItem("healthLV", newLV);
            }
            break;
        case 2: // Upgrade Fire Rate
            if (purchase(150 * (parseInt(localStorage.getItem("fireRateLV"))))) {
                newLV = (parseInt(localStorage.getItem("fireRateLV"), 10) + 1).toString();
                localStorage.setItem("fireRateLV", newLV);
            }
            break;
        case 3: // Upgrade Missile Cooldown
            if (purchase(150 + (parseInt(localStorage.getItem("missileCooldownLV")) * 100))) {
                newLV = (parseInt(localStorage.getItem("missileCooldownLV"), 10) + 1).toString();
                localStorage.setItem("missileCooldownLV", newLV);
            }
            break;
        case 4: // Upgrade Shield Health
            if (purchase(100 + (parseInt(localStorage.getItem("shieldHealthLV")) * 150))) {
                newLV = (parseInt(localStorage.getItem("shieldHealthLV"), 10) + 1).toString();
                localStorage.setItem("shieldHealthLV", newLV);
            }
            break;
        case 5: // Upgrade Shield Cooldown
            if (purchase(100 * parseInt(localStorage.getItem("shieldCooldownLV")))) {
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

function updateDisplay()
{
    document.getElementById("creditsDisplay").innerText = "Credits: " + localStorage.getItem("credits");

    const statLV = ["healthLV", "fireRateLV", "missileCooldownLV", "shieldHealthLV", "shieldCooldownLV"];
    const currStat = ["currHealth", "currFireRate", "currMissileCooldown", "currShieldHealth", "currShieldCooldown"];
    const costStat = ["costHealthButton", "costFireRateButton", "costMissileCooldownButton", "costShieldHealthButton", "costShieldCooldownButton"];

    // Current Level
    for(let i = 0; i < statLV.length; i++)
    {
        document.getElementById(statLV[i]).innerText = "LV: " + localStorage.getItem(statLV[i]);
    }

    // Current effect
    document.getElementById(currStat[0]).innerText = (4 + parseInt(localStorage.getItem("healthLV"))).toString();
    document.getElementById(currStat[1]).innerText = (1.5 - 0.5 * (parseInt(localStorage.getItem("fireRateLV")) - 1)).toString();
    document.getElementById(currStat[2]).innerText = (10 - (parseInt(localStorage.getItem("missileCooldownLV")) - 1) * 0.3).toString();
    document.getElementById(currStat[3]).innerText = (parseInt(localStorage.getItem("shieldHealthLV")) - 1).toString();
    document.getElementById(currStat[4]).innerText = (31 - parseInt(localStorage.getItem("shieldCooldownLV"))).toString();

    // Cost for upgrade
    document.getElementById(costStat[0]).innerText = (50 * parseInt(localStorage.getItem("healthLV"))).toString() + " Credits";
    document.getElementById(costStat[1]).innerText = (150 * (parseInt(localStorage.getItem("fireRateLV")))).toString() + " Credits";
    document.getElementById(costStat[2]).innerText = (150 + (parseInt(localStorage.getItem("missileCooldownLV")) * 100)).toString() + " Credits";
    document.getElementById(costStat[3]).innerText = (100 + (parseInt(localStorage.getItem("shieldHealthLV")) * 150)).toString() + " Credits";
    document.getElementById(costStat[4]).innerText = (100 * parseInt(localStorage.getItem("shieldCooldownLV"))).toString() + " Credits";
}

window.onload = function(){updateDisplay()};