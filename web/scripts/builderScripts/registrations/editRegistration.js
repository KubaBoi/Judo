var activeRegistration;
async function editRegistrationTab(registrationId) {
    showLoader();
    var response = null;
    response = await callEndpoint("GET", "/registeredClubs/get?id=" + registrationId);

    if (!response.ERROR) {
        activeRegistration = response.REGISTERED_CLUB;
        var hiddenTab = getHiddenTab();

        createElement("h2", hiddenTab, "Confirm registration");

        var mainDiv = createElement("div", hiddenTab, "", [
            {"name": "class", "value": "regEvDiv"}
        ]);

        var infoDiv = createElement("div", mainDiv, "", [
            {"name": "class", "value": "infoDiv"}
        ]);
        var tbl = createElement("table", infoDiv);
        
        var event = await getEventInfo(`/events/get?eventId=${activeRegistration.EVENT_ID}`);
        event = event.EVENT;
        var club = await getEventInfo(`/clubs/get?clubId=${activeRegistration.CLUB_ID}`);
        club = club.CLUB;
        var owner = await getEventInfo(`/users/get?userId=${club.USER_ID}`);
        owner = owner.USER;

        setDataToInfoTable(tbl, event, club, owner);

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
            {"name": "onclick", "value": `sendRegData(${event.ID}, ${club.ID})`}
        ]);

        cvsContents = [];

        openHiddenTab();
    } 
    else if (response.ERROR != "No cookies") {
        showErrorAlert(response.ERROR, alertTime);
    }

    hideLoader();
}

function confirmRegisterButton(regId, status) {
    if (status == 0) {
        editRegistrationTab(regId);
    }
    else if (status == 1) {
        showWrongAlert("Confirmed", "Registration has been confirmed.<br>Wait until client's confirmation.", alertTime);
    }
    else if (status == 2) {
        showOkAlert("Registrated", "Team is already registrated", alertTime);
    }
}

async function sendRegData(eventId, clubId) {
    if (cvsContents.length == 0) {
        showWrongAlert("No data", "You need to open file with data first", alertTime);
        return;
    }

    showLoader();
    
    let req = {
        "EVENT_ID": eventId,
        "CLUB_ID": clubId,
        "DATA": cvsContents
    };

    var response = await callEndpoint("POST", "/jb/createFromCvs", req);
    if (response.ERROR == null) {
        closeHiddenTab();
        showOkAlert("Done", "Data has been uploaded to server.", alertTime);
        buildRegistrationsTable();
    }
    else {
        showErrorAlert(response.ERROR);
    }

    hideLoader();
}