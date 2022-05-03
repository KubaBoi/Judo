debug = true;

var activeContent;
var alertTime = 2000;
var loggedUser = null;
var userAccountName;
var userName = getCookie("login");
var password = getCookie("password");
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