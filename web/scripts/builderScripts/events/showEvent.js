async function showEventTab(eventId) {
    var response = await callEndpoint("GET", "/events/get?eventId=" + eventId);
    if (!response.ERROR) {
        activeEvent = response.EVENT;

        var hiddenTab = openHiddenTab();

        createElement("h2", hiddenTab, activeEvent.NAME);
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

        createShowTableRow(dateTbl, "Start: ", activeEvent.EVENT_START);
        createShowTableRow(dateTbl, "End: ", activeEvent.EVENT_END);
        createShowTableRow(dateTbl, "Arrive: ", activeEvent.ARRIVE);
        createShowTableRow(dateTbl, "Departure: ", activeEvent.DEPART);
        createShowTableRow(dateTbl, "Visa deadline: ", activeEvent.END_VISA);
        createShowTableRow(dateTbl, "Room deadline: ", activeEvent.END_ROOM);

    } 
    else if (response.ERROR != "No cookies") {
        showErrorAlert(response.ERROR, alertTime);
    }
}