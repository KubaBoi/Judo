
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
    if (status == 3) {
        registerToEventShowHidden(eventId);
    }
    else if (status == 1) {
        registerToEventShow(eventId);
    }
}

// first part
async function registerToEventShowHidden(eventId) {
    showLoader();

    var hiddenTab = openHiddenTab();

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

    hideLoader();
    regEvShow();
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

function setDataToInfoTable(table, event) {
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
    createShowTableRow(table, "Name: ",  loggedClub.NAME);
    createShowTableRow(table, "State: ", loggedClub.STATE);
    createShowTableRow(table, "Address: ", loggedClub.ADDRESS);
    createShowTableRow(table, "EJU: ", loggedClub.EJU);

    createShowTableRowHeader(table, "OWNER", "");
    createShowTableRow(table, "Name: ",  loggedUser.FULL_NAME);
    createShowTableRow(table, "E-mail: ",  loggedUser.LOGIN);
    createShowTableRow(table, "Phone: ",  loggedUser.PHONE);
}

function chooseRegTab(button) {
    var buttons = document.getElementsByClassName("regTabButton");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("regTabButtonChosen");
    }
    button.classList.add("regTabButtonChosen");
}