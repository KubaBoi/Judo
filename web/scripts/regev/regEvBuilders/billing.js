
function isAllDone() {
    for (let i = 1; i < 5; i++) {
        if (getNotifStatus(i) != 1) return false;
    }
    return true;
}

async function calculateBill() {
    if (!isAllDone()) {
        changeNotification(5, "notifPend", "Calculation can be done when everything is set up properly", false);
        showNotifError(5);
        return;
    }
    changeNotification(5, "notifDone", "Done", false);

    let req = {
        "JBS": jbs,
        "ARRIVALS": arrivals,
        "DEPARTS": departs,
        "EVENT_ID": activeEvent.ID
    }

    var response = await callEndpoint("POST", "/registeredClubs/calculateBill", req);
    if (response.ERROR == null) {
        buildBillAccTable(response.BILL_ACC_DATA);
        buildBillPackTable(response.BILL_PACK_DATA);
    }
    else {
        showErrorAlert(response.ERROR, alertTime);
    }
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
        {"text": "RO/night"},
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
        {"text": "Price per night"},
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