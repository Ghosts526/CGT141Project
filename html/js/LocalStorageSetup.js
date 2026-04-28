function Setup()
{
    const data = ["topScore", "credits"];
    const lv = ["healthLV", "fireRateLV", "missileCooldownLV", "shieldHealthLV", "shieldCooldownLV"];
    const boolF = ["showCollisionBox", "godMode"];

    for (let i = 0; i < data.length; i++) {
        if (localStorage.getItem(data[i]) == null)
        {
            localStorage.setItem(data[i], "0");
        }
    }

    for (let i = 0; i < lv.length; i++) {
        if (localStorage.getItem(lv[i]) == null)
        {
            localStorage.setItem(lv[i], "1");
        }
    }

    for (let i = 0; i < boolF.length; i++)
    {
        if (localStorage.getItem(boolF[i]) == null)
        {
            localStorage.setItem(boolF[i], "false");
        }
    }
}

window.onload = function(){Setup()};