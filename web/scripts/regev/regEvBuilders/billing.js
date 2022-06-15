
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
}