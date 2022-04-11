async function register() {
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
        showAlert("An error occurred :(", response.ERROR);
    }
}

function backToLogin() {
    var loginDiv = document.getElementById("loginDiv");
    loginDiv.style.animationName = "loginBack";
    loginDiv.style.animationDuration = "0.5s";
    loginDiv.style.animationFillMode = "both";

    var regDiv = document.getElementById("registrationDiv");
    regDiv.style.animationName = "registrationOut";
    regDiv.style.animationDuration = "0.5s";
    regDiv.style.animationFillMode = "both";
}

function comeRegistration() {
    var loginDiv = document.getElementById("loginDiv");
    loginDiv.style.animationName = "loginDone";
    loginDiv.style.animationDuration = "0.5s";
    loginDiv.style.animationFillMode = "both";

    var regDiv = document.getElementById("registrationDiv");
    regDiv.style.animationName = "registrationCome";
    regDiv.style.animationDuration = "0.5s";
    regDiv.style.animationFillMode = "both";
}

function logout() {
    setCookie("userName", "", 0);
    setCookie("password", "", 0);
    location.reload();
}