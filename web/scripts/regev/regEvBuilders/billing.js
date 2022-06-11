
function isAllDone() {
    for (let i = 1; i < 5; i++) {
        if (getNotifStatus(i) != 1) return false;
    }
    return true;
}

function calculateBill() {
    if (!isAllDone()) {
        changeNotification(5, "notifPend", "Calculation can be done when everything is not set up properly", false);
        showNotifError(5);
        return;
    }
    changeNotification(5, "notifDone", "Done", false);

    console.log(rooms);    
}