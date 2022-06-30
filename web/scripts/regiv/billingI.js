
async function getPdfBillI() {
    showLoader();
    var response = await callEndpoint("GET", `/bills/getBillPdf?eventId=${activeEvent.ID}&regClubId=${regClubId}`);
    if (response.ERROR == null) {
        bill = response.BILL;
        window.open(`/bills/pdf/${bill}`, "_blank");
    }
    else {
        showErrorAlert(response.ERROR, alertTime);
    }
    hideLoader();
}

async function getXlsxBillI() {
    showLoader();
    var response = await callEndpoint("GET", `/bills/getBillXlsx?eventId=${activeEvent.ID}&regClubId=${regClubId}`);
    if (response.ERROR == null) {
        bill = response.BILL;
        window.open(`/bills/xlsx/${bill}`, "_blank");
    }
    else {
        showErrorAlert(response.ERROR, alertTime);
    }
    hideLoader();
}