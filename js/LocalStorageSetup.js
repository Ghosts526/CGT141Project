function Setup()
{
    const names = ["topScore", "credits", "healthLV", "fireRateLV", "missileCooldownLV", "shieldHealthLV", "shieldCooldownLV"];

    for (let i = 0; i < names.length; i++) {
        if (localStorage.getItem(names[i]) == null)
        {
            localStorage.setItem(names[i], "1");
        }
    }
}

window.onload = function(){Setup()};