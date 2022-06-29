var jbsD = []; 
var rooms = [];
var regIvTablesDiv = null;
var regClubId = null;

// scroll events
function onscrollDivI() {
    var pos = regIvTablesDiv.scrollTop;

    let peoplePos = document.getElementById("peopleIDiv").scrollHeight;
    let accoPos = document.getElementById("accIDiv").scrollHeight;
    let visaPos = document.getElementById("visaIDiv").scrollHeight;
    let covidTestsDiv = document.getElementById("covidTestsIDiv").scrollHeight;
    let arrivalPos = document.getElementById("arrivalIDiv").scrollHeight;
    let departurePos = document.getElementById("departureIDiv").scrollHeight;
    let billPos = document.getElementById("billingIDiv").scrollHeight;

    let btn = document.getElementById("regITabB0");

    if (peoplePos >= pos) {
        btn = document.getElementById("regITabB0");
    }
    else if (peoplePos + accoPos >= pos) {
        btn = document.getElementById("regITabB1");
    }
    else if (peoplePos + accoPos + visaPos >= pos) {
        btn = document.getElementById("regITabB2");
    }
    else if (peoplePos + accoPos + visaPos + covidTestsDiv >= pos) {
        btn = document.getElementById("regITabB3");
    }
    else if (peoplePos + accoPos + visaPos + covidTestsDiv + arrivalPos >= pos) {
        btn = document.getElementById("regITabB4");
    }
    else if (peoplePos + accoPos + visaPos + covidTestsDiv + arrivalPos + departurePos >= pos) {
        btn = document.getElementById("regITabB5");
    }
    else if (peoplePos + accoPos + visaPos + covidTestsDiv + arrivalPos + departurePos + billPos >= pos) {
        btn = document.getElementById("regITabB6");
    }
    changeButtonI(btn);
}

function changeButtonI(button) {
    var buttons = document.getElementsByClassName("regTabButton");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("regTabButtonChosen");
    }
    button.classList.add("regTabButtonChosen");
}

function chooseRegTabI(button, divId="peopleIDiv") {
    changeButtonI(button, divId);
    let div = document.getElementById(divId);
    div.scrollIntoView();
    document.body.scrollTo(0, 0);
}


async function buildRegIvTables(event) {
    activeEvent = event;

    regIvTablesDiv = document.getElementById("regIvTablesDiv");
    regIvTablesDiv.onscroll = onscrollDivI;

    showLoader();
    
    let response = await callEndpoint("GET", `/registeredClubs/getByEventAndClub?eventId=${activeEvent.ID}&clubId=${loggedClub.ID}`)
    if (response.ERROR != null) {
        showErrorAlert(response.ERROR, alertTime);
        return;
    }

    regClubId = response.REG_CLUB.ID;

    response = await callEndpoint("GET", `/registeredJb/getByRegisteredClub?regClubId=${response.REG_CLUB.ID}`);
    if (response.ERROR != null) {
        showErrorAlert(response.ERROR, alertTime);
    }
    let reg_jbs = response.REGISTERED_JBS;
    await buildPeopleTableI(reg_jbs);
    buildRoomTableI(reg_jbs);

    hideLoader();
}

async function buildPeopleTableI(reg_jbs) {
    let tbl = document.getElementById("peopleIDiv");
    clearTable(tbl);

    addHeader(tbl, [
        {"text": "Name"},
        {"text": "Country"},
        {"text": "Birthday"},
        {"text": "Function"}
    ]);

    for (let i = 0; i < reg_jbs.length; i++) {
        let regJb = reg_jbs[i];

        let response = await callEndpoint("GET", `/jb/get?jbId=${regJb.JB_ID}`);
        if (response.ERROR != null) {
            showErrorAlert(response.ERROR, alertTime);
            continue;
        }
        
        let jb = response.JB;
        jbsD.push(jb);
        addRow(tbl, [
            {"text": jb.SUR_NAME + " " + jb.NAME},
            {"text": jb.STATE},
            {"text": jb.BIRTHDAY},
            {"text": jb.FUNCTION}
        ]);
    }
}

async function buildRoomTableI(reg_jbs) {
    let roomDiv = document.getElementById("accRoomIDiv");
    clearTable(roomDiv);

    let roms = [];
    for (let i = 0; i < reg_jbs.length; i++) {
        let jb = reg_jbs[i];
        let response = await callEndpoint("GET", `/beds/roomByRegJb?regJbId=${jb.ID}`);
        if (response.ERROR != null) {
            showErrorAlert(response.ERROR, alertTime);
            continue;
        }
        jb.ROOM_ID = response.ROOM.ID;
        roms.push(response.ROOM);
    }
    console.log(roms);
    let width = "160px ";
    let rowCount = 5;
    let rowSize = Math.floor(100/rowCount);

    let cols = "";
    let rows = "";
    for (let i = 0; i < Math.ceil(roms.length/rowCount); i++) {
        cols += width;
    }
    for (let i = 0; i < rowCount; i++) {
        rows += `${rowSize}%`;
    }


    roomDiv.style.gridTemplateColumns = cols;
    roomDiv.style.gridTemplateRows = rows;

    for (let i = 0; i < roms.length; i++) {
        let room = roms[i];
        let img = "<img src='./images/bedIcon.png'>"
        let bedString = "";
        for (let o = 0; o < room.BED; o++) bedString += img;

        var oneRoomDiv = createElement("div", roomDiv, bedString + `${room.HOTEL_ID}`, [
            {"name": "class", "value": "accRoomRoomDiv"},
            {"name": "id", "value": `room${room.ID}`}
        ]);

        createElement("hr", oneRoomDiv);
        createElement("table", oneRoomDiv, "", [
            {"name": "id", "value": `roomTable${room.ID}`}
        ]);
    }

    for (let i = 0; i < reg_jbs.length; i++) {
        let reg_jb = reg_jbs[i];
        let jb = jbsD[i];

        var oneRoomTable = document.getElementById(`roomTable${reg_jb.ROOM_ID}`);

        addRow(oneRoomTable, [
            {"text": `${jb.SUR_NAME} ${jb.NAME.substring(0, 1)}`}
        ]);
    }
}

