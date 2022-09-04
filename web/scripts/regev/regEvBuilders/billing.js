
function isAllDone() {
    let notifications = document.getElementsByClassName("notification");
    for (let i = 0; i < notifications.length; i++) {
        let notif = notifications[i];
        if (notif.id == "notifBilling") continue;
        if (getNotifStatus(notif.id) != 1) return false;
    }
    return true;
}

async function getPdfBill() {
    if (!isAllDone()) {
        showWrongAlert("Error", "Calculation can be done when everything is set up properly", alertTime);
        return;
    }
    showLoader();
    let req = {
        "JBS": jbs,
        "ARRIVALS": arrivals,
        "DEPARTS": departs,
        "EVENT_ID": activeEvent.ID,
        "CLUB_ID": loggedClub.ID
    }

    var response = await callEndpoint("POST", "/bills/postBillPdf", req);
    if (response.ERROR == null) {
        bill = response.BILL;
        window.open(`/bills/pdf/${bill}`, "_blank");
    }
    else {
        changeNotification("notifBilling", "notifErr", "An error occured, please contact administrator", false);
        showErrorAlert(response.ERROR, alertTime);
    }
    hideLoader();
}

async function getXlsxBill() {
    if (!isAllDone()) {
        showWrongAlert("Error", "Calculation can be done when everything is set up properly", alertTime);
        return;
    }
    showLoader();
    let req = {
        "JBS": jbs,
        "ARRIVALS": arrivals,
        "DEPARTS": departs,
        "EVENT_ID": activeEvent.ID,
        "CLUB_ID": loggedClub.ID
    }

    var response = await callEndpoint("POST", "/bills/postBillXlsx", req);
    if (response.ERROR == null) {
        bill = response.BILL;
        window.open(`/bills/xlsx/${bill}`, "_blank");
    }
    else {
        changeNotification("notifBilling", "notifErr", "An error occured, please contact administrator", false);
        showErrorAlert(response.ERROR, alertTime);
    }
    hideLoader();
}

async function calculateBill() {
    if (!isAllDone()) {
        changeNotification("notifBilling", "notifPend", "Calculation can be done when everything is set up properly", false);
        showNotifError("notifBilling");
        changeConfirmButt(false);
        return;
    }
    changeNotification("notifBilling", "notifDone", "Done", false);

    let req = {
        "JBS": jbs,
        "ARRIVALS": arrivals,
        "DEPARTS": departs,
        "EVENT_ID": activeEvent.ID,
        "CLUB_ID": loggedClub.ID
    }

    var response = await callEndpoint("POST", "/registeredClubs/calculateBill", req);
    if (response.ERROR == null) {
        buildBillAccTable(response.BILL_ACC_DATA);
        buildBillPackTable(response.BILL_PACK_DATA);
        buildBillSumTable(response.BILL_SUM_DATA);
        changeConfirmButt(true);
    }
    else {
        changeNotification("notifBilling", "notifErr", "An error occured, please contact administrator", false);
        showErrorAlert(response.ERROR, alertTime);
    }
}

function changeConfirmButt(enabled) {
    let btn = document.getElementById("confirmButt");
    if (enabled) btn.removeAttribute("disabled");
    else btn.setAttribute("disabled", "");
}

function buildBillAccTable(billAccData) {
    let tbl = document.getElementById("regEvBillAccTable");
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

        addRow(tbl, [
            {"text": room.room_name},
            {"text": room.start_date},
            {"text": room.end_date},
            {"text": room.count_room},
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

function buildBillPackTable(billPackData) {
    let tbl = document.getElementById("regEvBillPackTable");
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

        addRow(tbl, [
            {"text": package.room_name},
            {"text": package.package_name},
            {"text": package.start_date},
            {"text": package.end_date},
            {"text": package.count_room},
            {"text": package.count_people},
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

function buildBillSumTable(billSumData) {
    let tbl = document.getElementById("regEvBillSumTable");
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

function confirmRegPart2() {
    if (!isAllDone()) {
        changeConfirmButt(false);
        return;
    }

    showConfirm("Are you sure?", "You will not be able to do any changes after this confirmation.", confirmRegPart2True);
}

async function confirmRegPart2True() {
    showLoader();

    let req = {
        "JBS": jbs,
        "ARRIVALS": arrivals,
        "DEPARTS": departs,
        "EVENT_ID": activeEvent.ID,
        "CLUB_ID": loggedClub.ID
    }

    let response = await callEndpoint("POST", "/registeredClubs/confirmReg", req);
    if (response.ERROR == null) {
        showOkAlert("Registered :)", "Your club has been successfully registered.", alertTime);
        buildEventTable();
        regEvClose();
    }
    else {
        showErrorAlert(response.ERROR, alertTime);
    }
    hideLoader();
}