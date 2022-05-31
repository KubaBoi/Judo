var jbs = []; // all jbs
var rooms = [];
var regEvTablesDiv = null;

// scroll events
function onscrollDiv() {
    var pos = regEvTablesDiv.scrollTop;

    let peoplePos = document.getElementById("peopleDiv").scrollHeight;
    let accoPos = document.getElementById("accDiv").scrollHeight;
    let visaPos = document.getElementById("visaDiv").scrollHeight;
    let arrivalPos = document.getElementById("arrivalDiv").scrollHeight;
    let departurePos = document.getElementById("departureDiv").scrollHeight;
    let billPos = document.getElementById("billingDiv").scrollHeight;

    let btn = document.getElementById("regTabB0");

    if (peoplePos >= pos) {
        btn = document.getElementById("regTabB0");
    }
    else if (peoplePos + accoPos >= pos) {
        btn = document.getElementById("regTabB1");
    }
    else if (peoplePos + accoPos + visaPos >= pos) {
        btn = document.getElementById("regTabB2");
    }
    else if (peoplePos + accoPos + visaPos + arrivalPos >= pos) {
        btn = document.getElementById("regTabB3");
    }
    else if (peoplePos + accoPos + visaPos + arrivalPos + departurePos >= pos) {
        btn = document.getElementById("regTabB4");
    }
    else if (peoplePos + accoPos + visaPos + arrivalPos + departurePos + billPos >= pos) {
        btn = document.getElementById("regTabB5");
    }
    changeButton(btn);
}

function changeButton(button) {
    var buttons = document.getElementsByClassName("regTabButton");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("regTabButtonChosen");
    }
    button.classList.add("regTabButtonChosen");
}

function chooseRegTab(button, divId="peopleDiv") {
    changeButton(button, divId);
    let div = document.getElementById(divId);
    div.scrollIntoView();
    document.body.scrollTo(0, 0);
}




async function buildRegEvTables(event) {
    regEvTablesDiv = document.getElementById("regEvTablesDiv");
    regEvTablesDiv.onscroll = onscrollDiv;

    showLoader();
    
    await buildPeopleTable(
        ["", "Name", "State", "Birthday", "Function"],
        ["checkbox", "SUR_NAME,NAME", "STATE", "BIRTHDAY", "FUNCTION"]
    );

    rooms = [];
    let hotels = event.HOTELS.split(",");
    for (let i = 0; i < hotels.length; i++) {
        var response = await callEndpoint("GET", `/hotels/getAvailableRooms?hotelId=${hotels[i]}`);
        if (response.ERROR == null) {
            let rms = response.ROOMS;
            for (let o = 0; o < rms.length; o++) {
                rooms.push(rms[o]);
            }
        }
    }

    rebuildRegEvTables();

    hideLoader();
}

function rebuildRegEvTables() {
    buildAccTable();
    buildRoomDiv();

    buildVisaTable();
    
    buildArrTable();
    buildDepTable();
}

