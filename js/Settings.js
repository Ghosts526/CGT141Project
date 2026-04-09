function clearData()
{
    localStorage.clear();
    console.log("Data Cleared");

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

    updateDisplay();
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

function addMoney(amount)
{
    localStorage.setItem("credits", amount.toString());
}

function showCollisionBox()
{
    if (localStorage.getItem("showCollisionBox") == "false") {
        localStorage.setItem("showCollisionBox", "true")
        document.getElementById("showCollisionBox").innerText = "Show Collision Box [On]"
    } else {
        localStorage.setItem("showCollisionBox", "false")
        document.getElementById("showCollisionBox").innerText = "Show Collision Box [Off]"
    }
}

function godMode()
{
    if (localStorage.getItem("godMode") == "false") {
        localStorage.setItem("godMode", "true")
        document.getElementById("godMode").innerText = "God Mode [On]"
    } else {
        localStorage.setItem("godMode", "false")
        document.getElementById("godMode").innerText = "God Mode [Off]"
    }
}

function updateDisplay()
{
    if (localStorage.getItem("showCollisionBox") == "false") {
        document.getElementById("showCollisionBox").innerText = "Show Collision Box [Off]"
    } else {
        document.getElementById("showCollisionBox").innerText = "Show Collision Box [On]"
    }

    if (localStorage.getItem("godMode") == "false") {
        document.getElementById("godMode").innerText = "God Mode [Off]"
    } else {
        document.getElementById("godMode").innerText = "God Mode [On]"
    }
}

window.onload = function(){updateDisplay()};