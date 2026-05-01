/**
 * This file handles the settings buttons and confirmation buttons
 */

const data = ["topScore", "credits"];
const lv = ["healthLV", "fireRateLV", "missileCooldownLV", "shieldHealthLV", "shieldCooldownLV"];
const boolF = ["showCollisionBox", "godMode"];
const boolT = ["useAudio", "touchMode"];

const switchButtons = ["gameplayButton", "dataManagementButton", "devToolkitButton"];
const switchTables = ["gameplayTable", "dataManagementTable", "devToolkitTable"];

// Gameplay Buttons
function audio() {
    if (localStorage.getItem("useAudio") == "false") {
        localStorage.setItem("useAudio", "true")
        document.getElementById("useAudio").innerText = "On"
    } else {
        localStorage.setItem("useAudio", "false")
        document.getElementById("useAudio").innerText = "Off"
    }
}

function touchMode() {
    if (localStorage.getItem("touchMode") == "false") {
        localStorage.setItem("touchMode", "true")
        document.getElementById("touchMode").innerText = "On"
    } else {
        localStorage.setItem("touchMode", "false")
        document.getElementById("touchMode").innerText = "Off"
    }
}

// Data Management Buttons
async function clearData() {
    if (!(await popUp("Are you sure?", "You CANNOT undo this!", "yes/no"))) {
        return;
    }

    localStorage.clear();
    console.log("Data Cleared");

    for (let i = 0; i < data.length; i++) {
        if (localStorage.getItem(data[i]) == null) {
            localStorage.setItem(data[i], "0");
        }
    }

    for (let i = 0; i < lv.length; i++) {
        if (localStorage.getItem(lv[i]) == null) {
            localStorage.setItem(lv[i], "1");
        }
    }

    for (let i = 0; i < boolF.length; i++) {
        if (localStorage.getItem(boolF[i]) == null) {
            localStorage.setItem(boolF[i], "false");
        }
    }

    for (let i = 0; i < boolT.length; i++) {
        if (localStorage.getItem(boolT[i]) == null) {
            localStorage.setItem(boolT[i], "true")
        }
    }

    updateDisplay();
}

async function printData() {
    let data = "";

    for (let i = 0; i < localStorage.length; i++) {
        data += formatData(localStorage.key(i) + " - " + localStorage.getItem(localStorage.key(i))) + "\n";
    }

    if (localStorage.length == 0) {
        data = "Empty Data";
    }

    if (!(await popUp("User Data", data, "close"))) {
        return;
    }
}

// Dev Toolkit Buttons
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

async function addMoney(amount) {
    localStorage.setItem("credits", (parseInt(localStorage.getItem("credits"), 10) + amount).toString());
    const currentCredits = "Total Credits: " + localStorage.getItem("credits");
    if (!(await popUp("Credits Added", currentCredits, "close"))) {
        return;
    }
}

function showCollisionBox() {
    if (localStorage.getItem("showCollisionBox") == "false") {
        localStorage.setItem("showCollisionBox", "true")
        document.getElementById("showCollisionBox").innerText = "On"
    } else {
        localStorage.setItem("showCollisionBox", "false")
        document.getElementById("showCollisionBox").innerText = "Off"
    }
}

function godMode() {
    if (localStorage.getItem("godMode") == "false") {
        localStorage.setItem("godMode", "true")
        document.getElementById("godMode").innerText = "On"
    } else {
        localStorage.setItem("godMode", "false")
        document.getElementById("godMode").innerText = "Off"
    }
}

function updateDisplay() {
    for (let i = 0; i < boolF.length; i++) {
        if (localStorage.getItem(boolF[i]) == "false") {
            document.getElementById(boolF[i]).innerText = "Off"
        } else {
            document.getElementById(boolF[i]).innerText = "On"
        }
    }

    for (let i = 0; i < boolT.length; i++) {
        if (localStorage.getItem(boolT[i]) == "false") {
            document.getElementById(boolT[i]).innerText = "Off"
        } else {
            document.getElementById(boolT[i]).innerText = "On"
        }
    }
}

function switchSettings(index) {
    document.getElementById(switchButtons[index]).classList.add("buttonSelected");
    document.getElementById(switchTables[index]).classList.remove("hidden");

    for (let i = 0; i < switchButtons.length; i++) {
        if (i != index) {
            document.getElementById(switchButtons[i]).classList.remove("buttonSelected");
            document.getElementById(switchTables[i]).classList.add("hidden");
        }
    }
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

window.onload = function () { updateDisplay() };