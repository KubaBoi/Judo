async function showEventTab(eventId) {
    showLoader();
    var response = await callEndpoint("GET", "/events/get?eventId=" + eventId);
    if (!response.ERROR) {
        let event = response.EVENT;

        var hiddenTab = getHiddenTab();

        createElement("h2", hiddenTab, event.NAME);
        var showDiv = createElement("div", hiddenTab, "",
        [
            {"name": "class", "value": "showTableDiv"}
        ]);

        var tbl = createElement("table", showDiv);

        createShowTableRowHeader(tbl, "General informations");
        createShowTableRow(tbl, "Name: ", event.NAME);
        createShowTableRow(tbl, "Category: ", event.CATEGORY);
        createShowTableRow(tbl, "Place: ", event.PLACE);
        createShowTableRow(tbl, "E-mail for visa: ", event.VISA_MAIL);
        createShowTableRow(tbl, "Phone for visa: ", event.VISA_PHONE);
        createShowTableRow(tbl, "EJU price: ", event.EJU_PRICE + " €");
        createShowTableRow(tbl, "PCR tests price: ", event.PCR_PRICE + " €");
        createShowTableRow(tbl, "Antigen tests price: ", event.AG_PRICE + " €");
        createShowTableRow(tbl, "Transport price: ", event.TRANS_PRICE + " €");
        createShowTableRow(tbl, "Other prices: ", event.OTHER_PRICE + " €");

        createShowTableRowHeader(tbl, "Time informations");
        createShowTableRow(tbl, "Start: ", formatDate(new Date(event.EVENT_START)));
        createShowTableRow(tbl, "End: ", formatDate(new Date(event.EVENT_END)));
        createShowTableRow(tbl, "Arrive: ", formatDatetime(new Date(event.ARRIVE)));
        createShowTableRow(tbl, "Departure: ", formatDatetime(new Date(event.DEPART)));
        createShowTableRow(tbl, "Visa deadline: ", formatDate(new Date(event.END_VISA)));
        createShowTableRow(tbl, "Room deadline: ", formatDate(new Date(event.END_ROOM)));

        createShowTableRowHeader(tbl, "Organiser");
        createShowTableRow(tbl, "Name: ", event.ORGANISER.FULL_NAME);
        createShowTableRow(tbl, "E-mail: ", event.ORGANISER.LOGIN);
        createShowTableRow(tbl, "Phone: ", event.ORGANISER.PHONE);

        openHiddenTab();
    } 
    else {
        showErrorAlert(response.ERROR, alertTime);
    }

    hideLoader();
}