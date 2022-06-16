
function regEvShow() {
    var registerToEventDiv = document.getElementById("registerToEventDiv");
    registerToEventDiv.style.animationName = "comeRegisterToEvent";
    registerToEventDiv.style.animationFillMode = "forwards";
    registerToEventDiv.style.animationDuration = "0.5s";
}

function regEvClose() {
    var registerToEventDiv = document.getElementById("registerToEventDiv");
    registerToEventDiv.style.animationName = "closeRegisterToEvent";
    registerToEventDiv.style.animationFillMode = "forwards";
    registerToEventDiv.style.animationDuration = "0.5s";
}

function registerButton(eventId, status) {
    if (loggedClub == null) {
        showConfirm("No club", "You can't register for event when you have not any club.<br>Do you want to create one?", buildClubTable);
        return
    }

    if (status == 3) {
        registerToEventShowHidden(eventId);
    }
    else if (status == 0) {
        showWrongAlert("Patience please", "Request for registration has been sent.<br>Wait until organiser's confirmation.", alertTime);
    }
    else if (status == 1) {
        registerToEventShow(eventId);
    }
    else if (status == 2) {
        showOkAlert("Registrated", "Your team is already registrated :)", alertTime);
    }
}

// first part
async function registerToEventShowHidden(eventId) {
    showLoader();

    var hiddenTab = getHiddenTab();

    createElement("h2", hiddenTab, "Registration");

    var showDiv = createElement("div", hiddenTab, "", [
        {"name": "class", "value": "showTableDiv"}
    ]);

    var event = await getEventInfo(`/events/get?eventId=${eventId}`);
    event = event.EVENT;
    var tbl = createElement("table", showDiv);
    setDataToInfoTable(tbl, event);

    createElement("button", hiddenTab, "Register", [
        {"name": "class", "value": "rightButton"},
        {"name": "onclick", "value": `registerToEvent(${eventId})`}
    ]);

    openHiddenTab();
    hideLoader();
}

//second part
async function registerToEventShow(eventId) {
    showLoader();

    chooseRegTab(document.getElementById("regTabB0"));

    var event = await getEventInfo(`/events/get?eventId=${eventId}`);
    event = event.EVENT;
    var dv = document.getElementById("regEvInfoDiv");
    clearTable(dv);

    var tbl = createElement("table", dv);
    setDataToInfoTable(tbl, event);

    await buildRegEvTables(event);

    hideLoader();
    regEvShow();

    let hideLabel = document.getElementById("hideLabel");
    if (hideLabel == null) {
        let div = document.getElementById("registerToEventDiv");
        createElement("button", div, "<b><<</b>", [
            {"name": "class", "value": "hideLabel"},
            {"name": "id", "value": "hideLabel"},
            {"name": "onclick", "value": "hideInfoDiv()"}
        ]);
    }
}

async function getEventInfo(url) {
    var response = await callEndpoint("GET", url);
    if (response.ERROR != null) {
        showErrorAlert(response.ERROR);
    } else {
        return response;
    }
    return "ERROR :/";
}

async function registerToEvent(eventId) {
    var req = {
        "CLUB_ID": loggedClub.ID,
        "EVENT_ID": eventId,
        "VISA": true
    };
    
    var response = await callEndpoint("POST", "/registeredClubs/create", req);
    if (response.ERROR == null) {
        closeHiddenTab();
        showOkAlert("DONE :)", "Your team has been registrated to event", alertTime);
        buildEventTable();
    }
    else {
        showErrorAlert(response.ERROR, alertTime);
    }
}

function setDataToInfoTable(table, event, club=loggedClub, user=loggedUser) {
    createShowTableRowHeader(table, "EVENT", "");
    createShowTableRow(table, "Name: ", event.NAME);
    createShowTableRow(table, "Category: ", event.CATEGORY);
    createShowTableRow(table, "Place: ", event.PLACE);
    createShowTableRow(table, "E-mail for visa: ", event.VISA_MAIL);
    createShowTableRow(table, "Phone for visa: ", event.VISA_PHONE);
    createShowTableRow(table, "EJU price: ", event.EJU_PRICE);
    createShowTableRow(table, "PCR tests price: ", event.PCR_PRICE);
    createShowTableRow(table, "Antigen tests price: ", event.AG_PRICE);
    createShowTableRow(table, "Transport price: ", event.TRANS_PRICE);
    createShowTableRow(table, "Other prices: ", event.OTHER_PRICE);

    createShowTableRowHeader(table, "CLUB", "");
    createShowTableRow(table, "Name: ",  club.NAME);
    createShowTableRow(table, "Country: ", club.STATE);
    createShowTableRow(table, "Address: ", club.ADDRESS);
    createShowTableRow(table, "EJU: ", club.EJU);

    createShowTableRowHeader(table, "OWNER", "");
    createShowTableRow(table, "Name: ",  user.FULL_NAME);
    createShowTableRow(table, "E-mail: ",  user.LOGIN);
    createShowTableRow(table, "Phone: ",  user.PHONE);
}

function hideInfoDiv() {
    let hideLabel = document.getElementById("hideLabel");
    let flightDiv = document.getElementById("regEvFlightsDiv");
    let infoDiv = document.getElementById("regEvInfoDiv");

    if (hideLabel.innerHTML == "<b>&lt;&lt;</b>") { // close
        hideLabel.innerHTML = "<b>>></b>";
        hideLabel.style.left = "-25px";
        flightDiv.style.width = "95%";
        infoDiv.style.opacity = "0%";
        infoDiv.style.width = "0";
    }
    else { // open
        hideLabel.innerHTML = "<b><<</b>";
        hideLabel.style.left = "18%";
        flightDiv.style.width = "75%";
        infoDiv.style.opacity = "100%";
        infoDiv.style.width = "20%";
    }
}