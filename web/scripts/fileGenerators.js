
async function generateEventPdf(eventId) {
    showLoader();
    let response = await callEndpoint("GET", `/bills/generateEventPdf?eventId=${eventId}`);
    if (response.ERROR == null) {
        pdf = response.PDF;
        window.open(`/bills/pdf/${pdf}`, "_blank");
    }
    else {
        showErrorAlert(response.ERROR, alertTime);
    }
    hideLoader();
}

async function generateEventShortPdf(eventId) {
    showLoader();
    let response = await callEndpoint("GET", `/bills/generateEventShortPdf?eventId=${eventId}`);
    if (response.ERROR == null) {
        pdf = response.PDF;
        window.open(`/bills/pdf/${pdf}`, "_blank");
    }
    else {
        showErrorAlert(response.ERROR, alertTime);
    }
    hideLoader();
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