
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

    var event = await getEventInfo(`/events/get?eventId=${eventId}`);
    document.getElementById("regEvName").innerHTML = event.EVENT.NAME;

    var clubs = await getEventInfo(`/clubs/getByUser?userId=${loggedUser.ID}`);
    var club = clubs.CLUBS[0];
    var tbl = document.getElementById("regEvClubTable");
    clearTable(tbl);

    createShowTableRow(tbl, "Name: ",  club.NAME);
    createShowTableRow(tbl, "State: ", club.STATE);
    createShowTableRow(tbl, "Address: ", club.ADDRESS);
    createShowTableRow(tbl, "EJU: ", club.EJU);

    var owner = await getEventInfo(`/users/get?userId=${club.USER_ID}`);
    owner = owner.USER;
    var tbl = document.getElementById("regEvOwnerTable");
    clearTable(tbl);

    createShowTableRow(tbl, "Name: ",  owner.FULL_NAME);
    createShowTableRow(tbl, "E-mail: ",  owner.LOGIN);
    createShowTableRow(tbl, "Phone: ",  owner.PHONE);

    hideLoader();
    regEvShow();
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