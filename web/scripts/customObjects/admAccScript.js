
var admAccActTime = 0;
var admAccInterval = null;

document.getElementById("admAccPassInp").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        openAdminAccess();
    }
});

function closeAdminAccess() {
    targetProxy.adminAccess = false;
    let admAccDiv = document.getElementById("adminAccessDiv");
    admAccDiv.setAttribute("class", "adminAccessClosed");
    document.getElementById("admAccPassInp").value = "";
    adminAccessStopTimer();
}

function openAdminAccessCheck() {
    if (targetProxy.adminAccess) {
        showWrongAlert("Notification", "You already are in <b>Admin Access Mode</b>", alertTime);
        return;
    }
    let admAccDiv = document.getElementById("adminAccessDiv");
    admAccDiv.setAttribute("class", "adminAccessCheck");
}

function openAdminAccess() {
    let pass = document.getElementById("admAccPassInp").value;

    if (pass != getCookie("password")) {
        showWrongAlert("Error", "Wrong credentials", alertTime);
    }
    else {
        targetProxy.adminAccess = true;
        let admAccDiv = document.getElementById("adminAccessDiv");
        admAccDiv.setAttribute("class", "adminAccessOpen");
        adminAccessStartTimer();
    }
}

function adminAccessStartTimer() {
    admAccActTime = 0;
    adminAccessTimer();
    admAccInterval = setInterval(adminAccessTimer, 1000);
}

function adminAccessStopTimer() {
    clearInterval(admAccInterval);
}

function adminAccessTimer() {
    let lbl = document.getElementById("adminAccessLabel");
    let timeRemain = adminAccessMaxTime - admAccActTime++;

    if (Math.floor(timeRemain/60) == 0) {
        lbl.innerHTML = `Expiration in: <label style="color:var(--wrong-color);">${addZero(Math.floor(timeRemain/60))}:${addZero(timeRemain%60)}</label>`;
    }
    else {
        lbl.innerHTML = `Expiration in: ${addZero(Math.floor(timeRemain/60))}:${addZero(timeRemain%60)}`;
    }

    if (timeRemain == 0) {
        closeAdminAccess();
    }
}

function addZero(integer) {
    let str = `${integer}`;
    if (str.length == 1) {
        return `0${str}`;
    }
    return str;
}