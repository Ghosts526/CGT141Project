const statLV = ["healthLV", "fireRateLV", "missileCooldownLV", "shieldHealthLV", "shieldCooldownLV"];

const currStat = ["currHealth", "currFireRate", "currMissileCooldown", "currShieldHealth", "currShieldCooldown"];

const costStat = ["costHealthButton", "costFireRateButton", "costMissileCooldownButton", "costShieldHealthButton", "costShieldCooldownButton"];

const nextStat = ["nextHealth", "nextFireRate", "nextMissileCooldown", "nextShieldHealth", "nextShieldCooldown"];

function upgrade(buttonNum)
{
    let newCredits = "";
    let newLV = "";

    if (purchase((5 * (parseInt(localStorage.getItem(statLV[buttonNum]), 10) ** 1.2)).toFixed(0))) {
        newLV = (parseInt(localStorage.getItem(statLV[buttonNum]), 10) + 1).toString();
        localStorage.setItem(statLV[buttonNum], newLV);
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

    // Current Level
    for(let i = 0; i < statLV.length; i++) {
        document.getElementById(statLV[i]).innerText = "LV: " + localStorage.getItem(statLV[i]);
        document.getElementById(costStat[i]).innerText = (5 * (parseInt(localStorage.getItem(statLV[i]), 10) ** 1.2)).toFixed(0) + " Credits"; // Cost for upgrade

        let stat = getStat(parseInt(localStorage.getItem(statLV[i]), 10), i);
        document.getElementById(currStat[i]).innerText = stat.curr;
        document.getElementById(nextStat[i]).innerText = stat.next;
    }
}


function getStat(lv, index) { //Returns the current stat and the increase or decrease to the next stat
    let currentEffect = 0, nextEffect = 0, effectDifference = 0;

    switch (index) {
        case 0:
            currentEffect = (4 + lv);
            nextEffect = (5 + lv);
            effectDifference = nextEffect - currentEffect;
            break;
        case 1:
            currentEffect = (1.5 * (0.92 ** (lv - 1))).toFixed(2);
            nextEffect = (1.5 * (0.92 ** (lv))).toFixed(2);
            effectDifference = (nextEffect - currentEffect).toFixed(2);
            break;
        case 2:
            currentEffect = (10 * (0.95 ** (lv - 1))).toFixed(2);
            nextEffect = (10 * (0.95 ** (lv))).toFixed(2);
            effectDifference = (nextEffect - currentEffect).toFixed(2);
            break;
        case 3:
            currentEffect = ((lv - 1) * 0.5).toFixed(1);
            nextEffect = ((lv) * 0.5).toFixed(1);
            effectDifference = (nextEffect - currentEffect).toFixed(1);
            break;
        case 4:
            currentEffect = (30 * (0.96 ** (lv - 1))).toFixed(2);
            nextEffect = (30 * (0.96 ** (lv))).toFixed(2);
            effectDifference = (nextEffect - currentEffect).toFixed(2);
            break;
        default:

    }

    effectDifference = (effectDifference <= 0) ? effectDifference : "+" + effectDifference;

    return { curr: currentEffect, next: effectDifference};
}

window.onload = function(){updateDisplay()};