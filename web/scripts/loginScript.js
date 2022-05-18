async function login(alert=true) {
    userName = document.getElementById("nameInp").value;
    password = document.getElementById("passInp").value;

    setCookie("login", userName, 5);
    setCookie("password", password, 5);

    authorization = `${userName}:${password}`;

    var response = await callEndpoint("GET", "/users/login");
    if (!response.ERROR) {
        setCookie("token", response.TOKEN, 5);
        loggedUser = response.USER;
        succLogin(response);
    } 
    else if (response.ERROR != "No cookies") {
        if (response.ERROR == "Wrong credentials") {
            showTimerAlert("Error", "Wrong credentials", alertTime, "divWrongAlert",
                {"name": "okShowAlert", "duration": "0.5s"},
                {"name": "okHideAlert", "duration": "0.5s"}
            );
        }
        else if (alert) {
            showErrorAlert(response.ERROR, alertTime);
        }
    }
}

async function succLogin(response) {
    showLoader();
    document.getElementById("singInButt").setAttribute("disabled", "");
    document.getElementById("regButt").setAttribute("disabled", "");
    document.getElementById("forgPassButt").setAttribute("disabled", "");

    if (response.USER.ROLE_ID == 2) {
        await getHtml("headerClient", "main/", "loggedDiv", "header");
        await getHtml("events", "main/",  "loggedDiv", "contentDiv");
    }
    else if (response.USER.ROLE_ID < 2) {
        await getHtml("headerAdmin", "adminFiles/", "loggedDiv", "header");
        await getHtml("events", "adminFiles/",  "loggedDiv", "contentDiv");
        await getHtml("allClubs", "adminFiles/",  "loggedDiv", "contentDiv");
        await getHtml("registrations", "adminFiles/",  "loggedDiv", "contentDiv");
        await getHtml("hotels", "adminFiles/",  "loggedDiv", "contentDiv");

        var loggedAs = document.getElementById("loggedAs");
        loggedAs.innerHTML = "admin<br>";
    }

    await getHtml("main", "main/",  "loggedDiv", "contentDiv");
    await getHtml("clubs", "main/",  "loggedDiv", "contentDiv");
    await getHtml("account", "main/",  "loggedDiv", "contentDiv");
    await getHtml("registerToEvent", "main/", "body", "registerToEventDiv");
    newContent("mainDiv");

    var loggedAs = document.getElementById("loggedAs");
    loggedAs.innerHTML += response.USER.FULL_NAME;

    var loginDiv = document.getElementById("loginDiv");
    loginDiv.style.animationName = "loginDone";
    loginDiv.style.animationDuration = "0.5s";
    loginDiv.style.animationFillMode = "forwards";
    
    var loggedDiv = document.getElementById("loggedDiv");
    loggedDiv.style.animationName = "loggedDivCome";
    loggedDiv.style.animationDuration = "0.5s";
    loggedDiv.style.animationFillMode = "forwards";

    var menu = document.getElementById("menuTable");
    menu.style.animationName = "menuRoll";
    menu.style.animationDuration = "1s";
    menu.style.animationDelay = "0.1s";
    menu.style.animationFillMode = "both";

    hideLoader();
}

function logout() {
    setCookie("userName", "", 0);
    setCookie("password", "", 0);
    location.reload();
}