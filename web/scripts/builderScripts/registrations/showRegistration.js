var activeRegClub = null;
var regJbs = [];

function registrationShow() {
    var registerToEventDiv = document.getElementById("registeredDiv");
    registerToEventDiv.style.animationName = "comeRegisterToEvent";
    registerToEventDiv.style.animationFillMode = "forwards";
    registerToEventDiv.style.animationDuration = "0.5s";
}

function registrationClose() {
    var registerToEventDiv = document.getElementById("registeredDiv");
    registerToEventDiv.style.animationName = "closeRegisterToEvent";
    registerToEventDiv.style.animationFillMode = "forwards";
    registerToEventDiv.style.animationDuration = "0.5s";
}

async function showRegistration(regId) {
    showLoader();

    registrationShow();

    let response = await callEndpoint("GET", `/registeredClubs/getAllDataForOne?regClubId=${regId}`);
    if (response.ERROR != null) {
        showErrorAlert(response.ERROR, alertTime);
        hideLoader();
        registrationClose();
        return;
    }
    activeRegClub = response.REGISTERED_CLUB;

    response = await callEndpoint("GET", `/users/get?userId=${activeRegClub.CLUB.USER_ID}`);
    if (response.ERROR != null) {
        showErrorAlert(response.ERROR, alertTime);
        hideLoader();
        registrationClose();
        return;
    }
    user = response.USER;

    var dv = document.getElementById("regInfoDiv");
    clearTable(dv);

    var tbl = createElement("table", dv);
    setDataToInfoTable(tbl, activeRegClub.EVENT, activeRegClub.CLUB, user);

    regjbs = [];
    response = await callEndpoint("GET", `/registeredJb/getByRegisteredClub?regClubId=${regId}`);
    if (response.ERROR != null) {
        showErrorAlert(response.ERROR, alertTime);
        hideLoader();
        registrationClose();
        return;
    }

    regJbs = response.REGISTERED_JBS;

    for (let i = 0; i < regJbs.length; i++) {
        response = await callEndpoint("GET", `/jb/get?jbId=${regJbs[i].JB_ID}`);
        if (response.ERROR != null) {
            showErrorAlert(response.ERROR, alertTime);
            hideLoader();
            registrationClose();
            regJbs[i].JB = {"NAME": " Found", "SUR_NAME": "Not"}
        } else regJbs[i].JB = response.JB;

        response = await callEndpoint("GET", `/hotels/getRoomData?regJbId=${regJbs[i].JB_ID}`);
        if (response.ERROR != null) {
            showErrorAlert(response.ERROR, alertTime);
            hideLoader();
            registrationClose();
            regJbs[i].ROOM_DATA = {"ROOM_NAME": "Not Found", "PACKAGE_NAME": "Not Found"}
        } else regJbs[i].ROOM_DATA = response.ROOM_DATA;

        response = await callEndpoint("GET", `/registeredTests/getByRegJb?regJbId=${regJbs[i].JB_ID}`);
        if (response.ERROR != null) {
            showErrorAlert(response.ERROR, alertTime);
            hideLoader();
            registrationClose();
            regJbs[i].TESTS = []
        } else regJbs[i].TESTS = response.TESTS;
    }

    buildArrivals();
    buildDeparts();
    buildRoomingList();

    hideLoader();
}

function buildArrivals() {
    let arrs = [];

    for (let i = 0; i < regJbs.length; i++) {
        let jb = regJbs[i];
        let skip = false;
        for (let o = 0; o < arrs.length; o++) {
            if (arrs[o].ARRIVE == jb.ARRIVE) {
                skip = true;
                arrs[o].JBS.push(jb);
                break;
            }
        }
        if (skip) continue;
        arrs.push(
            {
                "ARRIVE": jb.ARRIVE,
                "TRANSPORT": jb.TRANSPORT,
                "NUMBER": jb.FLIGHT_NUMBER,
                "JBS": [jb]
            }
        );
    }
    
    let tbl = document.getElementById("registeredArrTable");
    clearTable(tbl);
    addHeader(tbl, [
        {"text": "Arrival time"},
        {"text": "Flight number"},
        {"text": "Need transport"},
        {"text": "Number of people"}
    ]);

    for (let i = 0; i < arrs.length; i++) {
        let arr = arrs[i];

        let checkDiv =  createElement("label", null, "", [{"name": "class", "value": "checkBoxDiv"}]);
        createElement("input", checkDiv, "", [
            {"name": "type", "value": "checkbox"},
            {"name": "checked", "value": arr.TRANSPORT},
            {"name": "onclick", "value": "return false;"}
        ]);
        createElement("span", checkDiv, "", [{"name": "class", "value": "checkmark"}]);

        addRow(tbl, [
            {"text": formatDatetime(new Date(arr.ARRIVE), false)},
            {"text": arr.NUMBER},
            {"text": checkDiv.outerHTML},
            {"text": arr.JBS.length}
        ]);
    }
}

function buildDeparts() {
    let departs = [];

    for (let i = 0; i < regJbs.length; i++) {
        let jb = regJbs[i];
        let skip = false;
        for (let o = 0; o < departs.length; o++) {
            if (departs[o].DEPARTURE == jb.DEPARTURE) {
                skip = true;
                departs[o].JBS.push(jb);
                break;
            }
        }
        if (skip) continue;
        departs.push(
            {
                "DEPARTURE": jb.DEPARTURE,
                "TRANSPORT": jb.TRANSPORT,
                "JBS": [jb]
            }
        );
    }
    
    let tbl = document.getElementById("registeredDepTable");
    clearTable(tbl);
    addHeader(tbl, [
        {"text": "Departure time"},
        {"text": "Need transport"},
        {"text": "Number of people"}
    ]);

    for (let i = 0; i < departs.length; i++) {
        let depart = departs[i];

        let checkDiv =  createElement("label", null, "", [{"name": "class", "value": "checkBoxDiv"}]);
        createElement("input", checkDiv, "", [
            {"name": "type", "value": "checkbox"},
            {"name": "checked", "value": depart.TRANSPORT},
            {"name": "onclick", "value": "return false;"}
        ]);
        createElement("span", checkDiv, "", [{"name": "class", "value": "checkmark"}]);

        addRow(tbl, [
            {"text": formatDatetime(new Date(depart.DEPARTURE), false)},
            {"text": checkDiv.outerHTML},
            {"text": depart.JBS.length}
        ]);
    }
}

function buildRoomingList() {
    let tbl = document.getElementById("roomingListTable");
    clearTable(tbl);

    addHeader(tbl,[
        {"text": "Name"},
        {"text": "Arrive"},
        {"text": "Depart"},
        {"text": "Room"},
        {"text": "Package"},
        {"text": "PCR tests"},
        {"text": "AG tests"}
    ]);

    for (let i = 0; i < regJbs.length; i++) {
        let jb = regJbs[i];

        let pcrs = 0;
        let ags = 0;
        for (let o = 0; o < jb.TESTS.length; o++) {
            if (jb.TESTS[o].PCR) pcrs++;
            else ags++;
        }

        addRow(tbl, [
            {"text": jb.JB.SUR_NAME + " " + jb.JB.NAME},
            {"text": formatDatetime(new Date(jb.ARRIVE), false)},
            {"text": formatDatetime(new Date(jb.DEPARTURE), false)},
            {"text": jb.ROOM_DATA.ROOM_NAME},
            {"text": jb.ROOM_DATA.PACKAGE_NAME},
            {"text": pcrs},
            {"text": ags}
        ]);
    }
}
