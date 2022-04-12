async function showEventTab(eventId) {
    var response = await callEndpoint("GET", "/events/getEvent?id=" + eventId);
    if (!response.ERROR) {
        activeEvent = response.EVENT;
        var hiddenTab = openHiddenTab();

        var hdr = createElement("h2", hiddenTab, activeEvent.NAME);
        var showDiv = createElement("div", hiddenTab, "",
        [
            {"name": "class", "value": "showTableDiv"}
        ]);

        var tbl = createElement("table", showDiv);

        createShowTableRow(tbl, "Name: ", activeEvent.NAME);
        createShowTableRow(tbl, "Category: ", activeEvent.CATEGORY);
        createShowTableRow(tbl, "Place: ", activeEvent.PLACE);
        createShowTableRow(tbl, "E-mail for visa: ", activeEvent.VISA_MAIL);
        createShowTableRow(tbl, "Phone for visa: ", activeEvent.VISA_PHONE);
        createShowTableRow(tbl, "EJU price: ", activeEvent.EJU_PRICE);
        createShowTableRow(tbl, "PCR tests price: ", activeEvent.PCR_PRICE);
        createShowTableRow(tbl, "Antigen tests price: ", activeEvent.AG_PRICE);
        createShowTableRow(tbl, "Transport price: ", activeEvent.TRANS_PRICE);
        createShowTableRow(tbl, "Other prices: ", activeEvent.OTHER_PRICE);

        var dateTbl = createElement("table", showDiv);

        createShowTableRow(dateTbl, "Start: ", activeEvent.START);
        createShowTableRow(dateTbl, "End: ", activeEvent.END);
        createShowTableRow(dateTbl, "Arrive: ", activeEvent.ARRIVE);
        createShowTableRow(dateTbl, "Departure: ", activeEvent.DEPART);
        createShowTableRow(dateTbl, "Visa deadline: ", activeEvent.END_VISA);
        createShowTableRow(dateTbl, "Room deadline: ", activeEvent.END_ROOM);

    } 
    else if (response.ERROR != "No cookies") {
        showAlert("An error occurred :(", response.ERROR);
    }
}

function createShowTableRow(tbl, label, defValue) {
    var row = createElement("tr", tbl);
    createElement("td", row, label);
    createElement("td", row, defValue);
}