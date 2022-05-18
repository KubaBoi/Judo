async function register() {

    login = document.getElementById("mailInp").value;
    password = document.getElementById("regPass1Inp").value;
    password2 = document.getElementById("regPass2Inp").value;
    fullName = document.getElementById("fullNameInp").value;
    phone = document.getElementById("phoneInp").value;
    phone = document.getElementById("phoneCodeInp").value + " " + phone;

    if (password != password2) {
        showTimerAlert("Error", "Passwords are not same", alertTime, "divWrongAlert",
            {"name": "okShowAlert", "duration": "0.5s"},
            {"name": "okHideAlert", "duration": "0.5s"}
        );
        return;
    }

    if (!validateEmail(login)) {
        showTimerAlert("Error", "Email is in wrong format", alertTime, "divWrongAlert",
            {"name": "okShowAlert", "duration": "0.5s"},
            {"name": "okHideAlert", "duration": "0.5s"}
        );
        return;
    }

    request = {
        "LOGIN": login,
        "PASSWORD": password,
        "PHONE": phone,
        "FULL_NAME": fullName
    }

    var response = await callEndpoint("POST", "/users/register", request);
    if (!response.ERROR) {
        showTimerAlert("Registration", "Check your email and confirm registration", alertTime, "divOkAlert",
            {"name": "okShowAlert", "duration": "0.5s"},
            {"name": "okHideAlert", "duration": "0.5s"}
        );
    } 
    else if (response.ERROR != "User with this login already exists") {
        showErrorAlert(response.ERROR, alertTime);
    }
    else {
        showTimerAlert("Error", "This email is already registered", alertTime, "divWrongAlert",
            {"name": "okShowAlert", "duration": "0.5s"},
            {"name": "okHideAlert", "duration": "0.5s"}
        );
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

function validateEmail(email) {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};