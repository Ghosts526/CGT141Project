async function clearData()
{
    if (!(await popUp("Are you sure?", "You CANNOT undo this!", "yes/no"))) {
        return;
    }

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

async function printData()
{
    let data = "";

    for (let i = 0; i < localStorage.length; i++)
    {
        data += formatData(localStorage.key(i) + " - " + localStorage.getItem(localStorage.key(i))) + "\n";
    }

    if (localStorage.length == 0)
    {
        data = "Empty Data";
    }

    if (!(await popUp("User Data", data, "close"))) {
        return;
    }
}

function formatData(text) {
    // Space out capitalize letters
    let newText = text.replace(/([A-Z])/g, " $1");
    // Fix LV space
    newText = newText.replace(/L V/g, "LV");
    // Trim if in case it has empty spaces
    newText = newText.trim();
    // Capitalize the first letters
    newText = newText.replace(/\b\w/g, c => c.toUpperCase());
    // Return the formatted string
    return newText;
}

async function addMoney(amount)
{
    localStorage.setItem("credits", (parseInt(localStorage.getItem("credits"), 10) + amount).toString());
    const currentCredits = "Total Credits: " + localStorage.getItem("credits");
    if (!(await popUp("Credits Added", currentCredits, "close"))) {
        return;
    }
}

function showCollisionBox()
{
    if (localStorage.getItem("showCollisionBox") == "false") {
        localStorage.setItem("showCollisionBox", "true")
        document.getElementById("showCollisionBox").innerText = "On"
    } else {
        localStorage.setItem("showCollisionBox", "false")
        document.getElementById("showCollisionBox").innerText = "Off"
    }
}

function godMode()
{
    if (localStorage.getItem("godMode") == "false") {
        localStorage.setItem("godMode", "true")
        document.getElementById("godMode").innerText = "On"
    } else {
        localStorage.setItem("godMode", "false")
        document.getElementById("godMode").innerText = "Off"
    }
}

function updateDisplay()
{
    if (localStorage.getItem("showCollisionBox") == "false") {
        document.getElementById("showCollisionBox").innerText = "Off"
    } else {
        document.getElementById("showCollisionBox").innerText = "On"
    }

    if (localStorage.getItem("godMode") == "false") {
        document.getElementById("godMode").innerText = "Off"
    } else {
        document.getElementById("godMode").innerText = "On"
    }
}

function gameplayButton() {
    document.getElementById("gameplayTable").classList.remove("hidden");
    document.getElementById("gameplayButton").classList.add("buttonSelected");
    document.getElementById("dataManagementTable").classList.add("hidden");
    document.getElementById("dataManagementButton").classList.remove("buttonSelected");
    document.getElementById("devToolkitTable").classList.add("hidden");
    document.getElementById("devToolkitButton").classList.remove("buttonSelected");
}

function dataManagementButton() {
    document.getElementById("dataManagementTable").classList.remove("hidden");
    document.getElementById("dataManagementButton").classList.add("buttonSelected");
    document.getElementById("gameplayTable").classList.add("hidden");
    document.getElementById("gameplayButton").classList.remove("buttonSelected");
    document.getElementById("devToolkitTable").classList.add("hidden");
    document.getElementById("devToolkitButton").classList.remove("buttonSelected");
}

function devToolkitButton() {
    document.getElementById("devToolkitTable").classList.remove("hidden");
    document.getElementById("devToolkitButton").classList.add("buttonSelected");
    document.getElementById("gameplayTable").classList.add("hidden");
    document.getElementById("gameplayButton").classList.remove("buttonSelected");
    document.getElementById("dataManagementTable").classList.add("hidden");
    document.getElementById("dataManagementButton").classList.remove("buttonSelected");
}

function popUp(mainText, subText, actionType) { // Brings a pop to confirm or deny the action
    document.getElementById("popUp").classList.remove("hidden");
    if (actionType == "yes/no") {
        document.getElementById("action1").classList.remove("hidden");
        document.getElementById("action2").classList.remove("hidden");
        document.getElementById("action1").innerText = "Yes";  
        document.getElementById("action2").innerText = "No";  
    } else if (actionType == "close") {
        document.getElementById("action1").classList.add("hidden");
        document.getElementById("action2").classList.remove("hidden");
        document.getElementById("action2").innerText = "Close";  
    }

    document.getElementById("message").innerText = mainText;
    document.getElementById("subMessage").innerText = subText;

    return new Promise(resolve => {
        window._resolvePopUp = resolve;
    });
}

function popUpAction(num) {
    document.getElementById("popUp").classList.add("hidden");

    if (window._resolvePopUp) {
        window._resolvePopUp(num == 1);
        window._resolvePopUp = null;
    }
}

window.onload = function(){updateDisplay()};