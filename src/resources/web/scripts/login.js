async function login(alert=true) {
    userName = document.getElementById("nameInp").value;
    password = document.getElementById("passInp").value;

    setCookie("login", userName, 5);
    setCookie("password", password, 5);

    var response = await callEndpoint("GET", "/users/login");
    if (!response.ERROR) {
        setCookie("token", response.TOKEN, 5);
        succLogin(response);
    } 
    else if (response.ERROR != "No cookies") {
        if (alert) {
            showAlert("An error occurred :(", response.ERROR);
        }
    }
}

function succLogin(response) {
    var loggedAs = document.getElementById("loggedAs")
    loggedAs.innerHTML = response.USER.ACCOUNT_NAME;

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
}

function logout() {
    setCookie("userName", "", 0);
    setCookie("password", "", 0);
    location.reload();
}