
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

async function registerToEventShow(eventId) {
    showLoader();

    var hiddenTab = openHiddenTab();

    createElement("h2", hiddenTab, "Registration");

    var showDiv = createElement("div", hiddenTab, "", [
        {"name": "class", "value": "showTableDiv"}
    ]);

    var event = await getEventInfo(`/events/get?eventId=${eventId}`);
    event = event.EVENT;
    var tbl = createElement("table", showDiv);

    createShowTableRowHeader(tbl, "EVENT", "");
    createShowTableRow(tbl, "Name: ", event.NAME);
    createShowTableRow(tbl, "Category: ", event.CATEGORY);
    createShowTableRow(tbl, "Place: ", event.PLACE);
    createShowTableRow(tbl, "E-mail for visa: ", event.VISA_MAIL);
    createShowTableRow(tbl, "Phone for visa: ", event.VISA_PHONE);
    createShowTableRow(tbl, "EJU price: ", event.EJU_PRICE);
    createShowTableRow(tbl, "PCR tests price: ", event.PCR_PRICE);
    createShowTableRow(tbl, "Antigen tests price: ", event.AG_PRICE);
    createShowTableRow(tbl, "Transport price: ", event.TRANS_PRICE);
    createShowTableRow(tbl, "Other prices: ", event.OTHER_PRICE);

    var clubs = await getEventInfo(`/clubs/getByUser?userId=${loggedUser.ID}`);
    var club = clubs.CLUBS[0];

    createShowTableRowHeader(tbl, "CLUB", "");
    createShowTableRow(tbl, "Name: ",  club.NAME);
    createShowTableRow(tbl, "State: ", club.STATE);
    createShowTableRow(tbl, "Address: ", club.ADDRESS);
    createShowTableRow(tbl, "EJU: ", club.EJU);

    var owner = await getEventInfo(`/users/get?userId=${club.USER_ID}`);
    owner = owner.USER;

    createShowTableRowHeader(tbl, "OWNER", "");
    createShowTableRow(tbl, "Name: ",  owner.FULL_NAME);
    createShowTableRow(tbl, "E-mail: ",  owner.LOGIN);
    createShowTableRow(tbl, "Phone: ",  owner.PHONE);

    createElement("button", hiddenTab, "Register", [
        {"name": "class", "value": "rightButton"},
        {"name": "onclick", "value": `registerToEvent(${eventId}, ${club.ID}, ${club.VISA})`}
    ]);

    hideLoader();
}

async function getEventInfo(url) {
    var response = await callEndpoint("GET", url);
    if (response.ERROR != null) {
        console.log(response.ERROR);
        showErrorAlert(response.ERROR);
    } else {
        return response;
    }
    return "ERROR :/";
}

async function registerToEvent(eventId, clubId, visa) {
    var req = {
        "CLUB_ID": clubId,
        "EVENT_ID": eventId,
        "VISA": visa
    };

    var response = await callEndpoint("POST", "/registeredClubs/create", req);
    if (response.ERROR == null) {
        closeHiddenTab();
        showOkAlert("DONE :)", "Your team has been registrated to event");
    }
    else {
        showErrorAlert(response.ERROR);
    }
}