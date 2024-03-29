debug = false;

const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// DETECT SAFARI
var isSafari = window.safari !== undefined;
if (isSafari) {
    showAlert("Safari!", `You are using Safari, but the developer does not have Safari. 
    So there is no guarantee that everything will work properly.<br>Sorry about that.`
    );
}

var activeContent;
var alertTime = 3000;
var switchTime = 300;

var adminAccessMaxTime = 10*60; // ten minutes;

var loggedUser = null;
var loggedClub = null;
var usersClubs = null;

targetProxy.adminAccess = false;

var userAccountName;
var userName = getCookie("login");
var password = getCookie("password");

var loadingDiv = document.getElementById("loaderDiv");

var countryCodes = "";
var functionsCodes = "";
loadHtmlCodes();
async function loadHtmlCodes() {
    countryCodes = await getHtmlCode("/webParts/authorization/countryCodes.html");
    functionsCodes = await getHtmlCode("/webParts/authorization/functions.html");
}

var badgeTypes = [
    createElement("img", null, "", [
        {"name": "src", "value": "./images/pendingIcon.png"},
        {"name": "class", "value": "pendingBadge"},
        {"name": "title", "value": "Waiting for organiser's confirmation"}
    ]).outerHTML,
    createElement("img", null, "", [
        {"name": "src", "value": "./images/pendingIcon.png"},
        {"name": "class", "value": "checkedBadge"},
        {"name": "title", "value": "Waiting for client's confirmation"}
    ]).outerHTML,
    createElement("img", null, "", [
        {"name": "src", "value": "./images/okIcon.png"},
        {"name": "class", "value": "registeredBadge"},
        {"name": "title", "value": "Registered"}
    ]).outerHTML,
    createElement("img", null, "", [
        {"name": "src", "value": "./images/registerIcon.png"},
        {"name": "class", "value": "needVisa"},
        {"name": "title", "value": "Register for the event"}
    ]).outerHTML
];

loadPage(["login", "registration", "phoneCodes"], true);

// startArray are divs that are nnecessary for first run
// divArray are others that do not need to be now
async function loadPage(startArray, doAfter=false) {
    for (let i = 0; i < startArray.length; i++) {
        var name = startArray[i];
        var response = await callEndpoint("GET", "/webParts/authorization/" + name + ".html")
        if (response.ERROR == null) {
            var div = document.getElementById(name + "Div");
            div.innerHTML = response;
        }
    }
    if (doAfter)
        after();
    
    document.body.scrollTo(0, 0);
}

async function getHtml(name, path, parentId, attributeClass) {
    var response = await callEndpoint("GET",
         "/webParts/" + path + name + ".html")
    if (!response.ERROR) {
        var parent = document.getElementById(parentId);
        var div = createElement("div", parent, "", 
        [
            {"name": "id", "value": name + "Div"},
            {"name": "class", "value": attributeClass} 
        ]);
        div.innerHTML = response;
    }
}

function after() {
    document.getElementById("nameInp").value = userName;
    document.getElementById("passInp").value = password;
    document.body.scrollTo(0, 0);

    document.getElementById("nameInp").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            login();
        }
    });
    document.getElementById("passInp").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            login();
        }
    });

    if (userName && password) {
        login(false);
    }

    prepareSelect();
}

async function getHtmlCode(url) {
    let response = await callEndpoint("GET", url);
    if (response.ERROR == null) {
        return response;
    }
    return "";
}