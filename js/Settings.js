function clearData()
{
    localStorage.clear();
    console.log("Data Cleared");

    const data = ["topScore", "credits"];
    const lv = ["healthLV", "fireRateLV", "missileCooldownLV", "shieldHealthLV", "shieldCooldownLV"];

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
}

function printData()
{
    for (let i = 0; i < localStorage.length; i++)
    {
        console.log(localStorage.key(i) + " - " + localStorage.getItem(localStorage.key(i)));
    }

    if (localStorage.length == 0)
    {
        console.log("Empty Data");
    }
}