async function editRegistrationTab(eventId) {
    showLoader();

    var response = null;
    response = await callEndpoint("GET", `/events/getAllData?eventId=${eventId}`);
    if (response.ERROR == null) {
        let event = response.EVENT;
        var hiddenTab = getHiddenTab();

        createElement("h2", hiddenTab, "Confirm registration");

        var mainDiv = createElement("div", hiddenTab, "", [
            {"name": "class", "value": "regEvDiv"}
        ]);

        var infoDiv = createElement("div", mainDiv, "", [
            {"name": "class", "value": "infoDiv"}
        ]);
        var tbl = createElement("table", infoDiv);

        setDataToInfoRegTable(tbl, event);

        var flightDiv = createElement("div", mainDiv, "", [
            {"name": "class", "value": "flightDiv"}
        ]);

        createElement("button", flightDiv, "Open File", [
            {"name": "onclick", "value": "openFile()"}
        ]);

        createElement("label", flightDiv, "", [
            {"name": "id", "value": "countLabel"}
        ])

        var jbsTable = createElement("table", flightDiv, "", [
            {"name": "id", "value": "jbsTable"}
        ]);

        clearTable(jbsTable);
        addHeader(jbsTable, [
            {"text": "JB id"},
            {"text": "Last name"},
            {"text": "First name"},
            {"text": "Country"},
            {"text": "Birthday"},
            {"text": "Function"},
            {"text": "Gender"}
        ]);

        createElement("p", flightDiv, "Upload file with JudoBase data", [
            {"name": "id", "value": "uploadLabel"}
        ]);

        createElement("button", hiddenTab, "Upload data", 
        [
            {"name": "class", "value": "rightButton"},
            {"name": "onclick", "value": `sendRegDataCheck(${event.ID})`}
        ]);

        cvsContents = [];

        openHiddenTab();
    } 
    else if (response.ERROR != "No cookies") {
        showErrorAlert(response.ERROR, alertTime);
    }

    hideLoader();
}

function sendRegDataCheck(eventId) {
    if (cvsContents.length == 0) {
        showConfirm("No data", "There are no data to be uploaded.<br>That's not a problem just reminder.<br>Do you want to continue?",
            function() {sendRegData(eventId);}
        );
    }
    else {
        sendRegData(eventId);
    }
}

async function sendRegData(eventId) {
    showLoader();
    
    let req = {
        "EVENT_ID": eventId,
        "DATA": cvsContents
    };

    var response = await callEndpoint("POST", "/jb/createFromCvs", req);
    if (response.ERROR == null) {
        closeHiddenTab();
        showOkAlert("Done", "Data has been uploaded to server.", alertTime);
        buildRegistrationsTable();
    }
    else {
        showErrorAlert(response.ERROR, alertTime);
    }

    hideLoader();
}

function setDataToInfoRegTable(table, event) {
    createShowTableRowHeader(table, "EVENT", "");
    createShowTableRow(table, "Name: ", event.NAME);
    createShowTableRow(table, "Category: ", event.CATEGORY);
    createShowTableRow(table, "Place: ", event.PLACE);
    createShowTableRow(table, "E-mail for visa: ", event.VISA_MAIL);
    createShowTableRow(table, "Phone for visa: ", event.VISA_PHONE);
    createShowTableRow(table, "EJU price: ", event.EJU_PRICE + " €");
    createShowTableRow(table, "PCR tests price: ", event.PCR_PRICE + " €");
    createShowTableRow(table, "Antigen tests price: ", event.AG_PRICE + " €");
    createShowTableRow(table, "Transport price: ", event.TRANS_PRICE + " €");
    createShowTableRow(table, "Other prices: ", event.OTHER_PRICE + " €");

    createShowTableRowHeader(table, "CLUBS", "");
    let regClubs = event.REG_CLUBS;
    for (let i = 0; i < regClubs.length; i++) {
        let regClub = regClubs[i];
        createShowTableRow(table, getImage(regClub.CLUB.STATE, false) + " " + regClub.CLUB.NAME, badgeTypes[regClub.STATUS]);
    }
}