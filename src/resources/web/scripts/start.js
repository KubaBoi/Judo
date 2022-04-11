debug = true;
var userAccountName;
var userName = getCookie("login");
var password = getCookie("password");
loadPage(
    ["login", "registration", "header", "hotels", "phoneCodes"], 
    ["main", "events", "clubs", "categ", "transport", "guide"]
)

// startArray are divs that are ennecessary for first run
// divArray are others that do not need to be now
async function loadPage(startArray, divArray) {
    for (let i = 0; i < startArray.length; i++) {
        var name = startArray[i];
        var response = await callEndpoint("GET", "/webParts/" + name + ".html")
        if (!response.ERROR) {
            var div = document.getElementById(name + "Div");
            div.innerHTML = response;
        }
    }

    after();

    for (let i = 0; i < divArray.length; i++) {
        getHtml(divArray[i]);
    }
}

async function getHtml(name) {
    var response = await callEndpoint("GET", "/webParts/" + name + ".html")
    if (!response.ERROR) {
        var div = document.getElementById(name + "Div");
        div.innerHTML = response;
    }
}

function after() {
    newContent("mainDiv");

    document.getElementById("nameInp").value = userName;
    document.getElementById("passInp").value = password;

    if (userName && password) {
        login(false);
    }

    prepareSelect();

    // hotels input select
    var hotelSearchInp = document.getElementById("hotelSearchInp");
    hotelSearchInp.addEventListener("keydown", function(e) {
        setTimeout(buildHotelTable, 100);
    });
}