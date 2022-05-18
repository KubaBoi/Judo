debug = true;

var activeContent;
var alertTime = 3000;
var switchTime = 300;

var loggedUser = null;
var loggedClub = null;

var userAccountName;
var userName = getCookie("login");
var password = getCookie("password");

var loadingDiv = document.getElementById("loaderDiv");

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
        if (!response.ERROR) {
            var div = document.getElementById(name + "Div");
            div.innerHTML = response;
        }
    }
    if (doAfter)
        after();
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

    if (userName && password) {
        login(false);
    }

    prepareSelect();
}