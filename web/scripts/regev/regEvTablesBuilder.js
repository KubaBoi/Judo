var jbs = []; // all jbs
var rooms = [];
var regEvTablesDiv = null;
var activeEvent = null;
var weekdayArray = [];

// scroll events
function onscrollDiv() {
    var pos = regEvTablesDiv.scrollTop;

    let peoplePos = document.getElementById("peopleDiv").scrollHeight;
    let accoPos = document.getElementById("accDiv").scrollHeight;
    let visaPos = document.getElementById("visaDiv").scrollHeight;
    let covidTestsDiv = document.getElementById("covidTestsDiv").scrollHeight;
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
    else if (peoplePos + accoPos + visaPos + covidTestsDiv >= pos) {
        btn = document.getElementById("regTabB3");
    }
    else if (peoplePos + accoPos + visaPos + covidTestsDiv + arrivalPos >= pos) {
        btn = document.getElementById("regTabB4");
    }
    else if (peoplePos + accoPos + visaPos + covidTestsDiv + arrivalPos + departurePos >= pos) {
        btn = document.getElementById("regTabB5");
    }
    else if (peoplePos + accoPos + visaPos + covidTestsDiv + arrivalPos + departurePos + billPos >= pos) {
        btn = document.getElementById("regTabB6");
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
    activeEvent = event;

    regEvTablesDiv = document.getElementById("regEvTablesDiv");
    regEvTablesDiv.onscroll = onscrollDiv;

    showLoader();

    let startDate = new Date(activeEvent.EVENT_START);
    let endDate = new Date(activeEvent.EVENT_END);
    weekdayArray = [];

    while (startDate.getTime() <= endDate.getTime()) {
        weekdayArray.push(weekday[startDate.getDay()]);
        startDate.setDate(startDate.getDate() + 1);
    }
    
    await buildPeopleTable(
        ["", "Name", "Birthday", "Function"],
        ["checkbox", "SUR_NAME,NAME", "BIRTHDAY", "FUNCTION"]
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
    buildCovidTestsTable();
    
    buildArrTable();
    buildDepTable();
}
