function Setup()
{
    let names = ["topScore", "credits", "healthLV", "fireRateLV", "missleCooldownLV", "shieldHealthLV", "shieldCooldownLV"];

    for (let i = 0; i < names.length; i++) {
        if (localStorage.getItem(names[i]) == null)
        {
            localStorage.setItem(names[i], "0");
        }
    }
}

window.onload = function(){Setup()};