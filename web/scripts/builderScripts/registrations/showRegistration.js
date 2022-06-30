var activeRegClub = null;
var regJbs = [];

var bad = null;
var bpd = null;
var bsm = null;

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

    activeEvent = activeRegClub.EVENT;
    regClubId = regId;

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
    await buildBillTbls();

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
            {"text": formatDate(new Date(jb.ARRIVE), false)},
            {"text": formatDate(new Date(jb.DEPARTURE), false)},
            {"text": jb.ROOM_DATA.ROOM_NAME},
            {"text": jb.ROOM_DATA.PACKAGE_NAME},
            {"text": pcrs},
            {"text": ags}
        ]);
    }
}

async function updateBill() {
    showLoader();

    for (let i = 0; i < bad.ROOMS.length; i++) {
        bad.ROOMS[i].start_date = document.getElementById(`arrDate${i}`).value;
        bad.ROOMS[i].end_date = document.getElementById(`depDate${i}`).value;
        bad.ROOMS[i].count_room = getValueOf(`numRooms${i}`);
    }
    for (let i = 0; i < bpd.PACKAGES.length; i++) {
        bpd.PACKAGES[i].start_date = document.getElementById(`arrPDate${i}`).value;
        bpd.PACKAGES[i].end_date = document.getElementById(`depPDate${i}`).value;
        bpd.PACKAGES[i].count_people = getValueOf(`numPPeople${i}`);
    }
     //"EVENT_ID", "REG_CLUB_ID", "BAD", "BPD", "BSD"
    let req = {
        "EVENT_ID": activeEvent.ID,
        "REG_CLUB_ID": regClubId,
        "BAD": bad,
        "BPD": bpd,
        "BSD": bsd
    };

    let response = await callEndpoint("POST", `/bills/recalculate`, req);
    if (response.ERROR != null) {
        showErrorAlert(response.ERROR, alertTime);
        hideLoader();
    }
    await buildBillTbls();
    hideLoader();
}

async function buildBillTbls() {
    let response = await callEndpoint("GET", `/bills/getBillData?eventId=${activeEvent.ID}&regClubId=${regClubId}`);
    if (response.ERROR != null) {
        showErrorAlert(response.ERROR, alertTime);
        return;
    }

    bad = response.BAD;
    bpd = response.BPD;
    bsd = response.BSD;

    buildBADTable(bad);
    buildBPDTable(bpd);
    buildBSDTable(bsd);
}

function buildBADTable(billAccData) {
    let tbl = document.getElementById("accBillTable");
    clearTable(tbl);

    addHeader(tbl, [
        {"text": "Room type"},
        {"text": "Arrival"},
        {"text": "Departure"},
        {"text": "Number of rooms"},
        {"text": "Number of people"},
        {"text": "Nights"},
        {"text": "RO/night €"},
        {"text": "Total €"}
    ]);

    for (let i = 0; i < billAccData.ROOMS.length; i++) {
        let room = billAccData.ROOMS[i];

        let arrDate = createElement("input", null, "", [
            {"name": "type", "value": "date"},
            {"name": "value", "value": getDate(room.start_date)},
            {"name": "id", "value": `arrDate${i}`}
        ]);
        let depDate = createElement("input", null, "", [
            {"name": "type", "value": "date"},
            {"name": "value", "value": getDate(room.end_date)},
            {"name": "id", "value": `depDate${i}`}
        ]);
        let numRooms = createElement("input", null, "", [
            {"name": "type", "value": "number"},
            {"name": "value", "value": room.count_room},
            {"name": "id", "value": `numRooms${i}`}
        ]);
        
        addRow(tbl, [
            {"text": room.room_name},
            {"text": arrDate.outerHTML},
            {"text": depDate.outerHTML},
            {"text": numRooms.outerHTML},
            {"text": room.count_people},
            {"text": room.nights},
            {"text": room.price_ro},
            {"text": room.total}
        ]);
    }

    addHeader(tbl, [
        {"text": "ACCOMODATION TOTAL"},
        {"text": ""},
        {"text": ""},
        {"text": ""},
        {"text": ""},
        {"text": ""},
        {"text": ""},
        {"text": billAccData.total}
    ]);
}

function buildBPDTable(billPackData) {
    let tbl = document.getElementById("pckBillTable");
    clearTable(tbl);

    addHeader(tbl, [
        {"text": "Room type"},
        {"text": "Package"},
        {"text": "Arrival"},
        {"text": "Departure"},
        {"text": "Number of rooms"},
        {"text": "Number of people"},
        {"text": "Nights"},
        {"text": "Price per night €"},
        {"text": "Total €"}
    ]);

    for (let i = 0; i < billPackData.PACKAGES.length; i++) {
        let package = billPackData.PACKAGES[i];

        let arrDate = createElement("input", null, "", [
            {"name": "type", "value": "date"},
            {"name": "value", "value": getDate(package.start_date)},
            {"name": "id", "value": `arrPDate${i}`}
        ]);
        let depDate = createElement("input", null, "", [
            {"name": "type", "value": "date"},
            {"name": "value", "value": getDate(package.end_date)},
            {"name": "id", "value": `depPDate${i}`}
        ]);
        let numPeople = createElement("input", null, "", [
            {"name": "type", "value": "number"},
            {"name": "value", "value": package.count_people},
            {"name": "id", "value": `numPPeople${i}`}
        ]);

        addRow(tbl, [
            {"text": package.room_name},
            {"text": package.package_name},
            {"text": arrDate.outerHTML},
            {"text": depDate.outerHTML},
            {"text": package.count_room},
            {"text": numPeople.outerHTML},
            {"text": package.nights},
            {"text": package.price},
            {"text": package.total}
        ]);
    }

    addHeader(tbl, [
        {"text": "PACKAGES TOTAL"},
        {"text": ""},
        {"text": ""},
        {"text": ""},
        {"text": ""},
        {"text": ""},
        {"text": ""},
        {"text": ""},
        {"text": billPackData.total}
    ]);
}

function buildBSDTable(billSumData) {
    let tbl = document.getElementById("sumBillTable");
    clearTable(tbl);

    addHeader(tbl, [
        {"text": "Name"},
        {"text": "Number"},
        {"text": "Price €"},
        {"text": "Total €"}
    ]);

    for (let i = 0; i < billSumData.ITEMS.length; i++) {
        let package = billSumData.ITEMS[i];

        addRow(tbl, [
            {"text": package.name},
            {"text": package.number},
            {"text": package.price},
            {"text": package.total}
        ]);
    }

    addHeader(tbl, [
        {"text": "==== TOTAL ===="},
        {"text": ""},
        {"text": ""},
        {"text": billSumData.total}
    ]);
}