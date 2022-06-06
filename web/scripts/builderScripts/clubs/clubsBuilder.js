var clubTable;

async function buildClubAllTable() {
    showLoader();
    clubTable = document.getElementById("clubAllTable");

    var response = await callEndpoint("GET", "/clubs/getAll");
    if (!response.ERROR) {
        clubTable.innerHTML = "";
        createClubHeaderRow();
        for (var i = 0; i < response.CLUBS.length; i++) {
            buildClubRow(response.CLUBS[i]);
        }
    } 
    else if (response.ERROR != "No cookies") {
        showErrorAlert(response.ERROR, alertTime);
    }

    hideLoader();
    newContent("allClubsDiv");
}

async function buildClubTable() {
    showLoader();
    clubTable = document.getElementById("clubTable");

    var response = await callEndpoint("GET", "/clubs/getByUser?userId=" + loggedUser.ID);
    if (!response.ERROR) {
        clubTable.innerHTML = "";
        createClubHeaderRow(true);
        for (var i = 0; i < response.CLUBS.length; i++) {
            buildClubRow(response.CLUBS[i], true);
        }
    } 
    else if (response.ERROR != "No cookies") {
        showErrorAlert(response.ERROR, alertTime);
    }

    hideLoader();
    newContent("clubsDiv");
}

async function buildClubRow(club, owner=false) {
    var row = createElement("tr", clubTable);
    createElement("td", row, club.NAME, 
    [
        {"name": "onclick", "value": "showClubTab(" + club.ID + ")"}
    ]);

    createElement("td", row, club.STATE, 
    [
        {"name": "onclick", "value": "showClubTab(" + club.ID + ")"}
    ]);
    
    var ownerName = "Not loaded";
    var response = await callEndpoint("GET", `/users/get?userId=${club.USER_ID}`);
    if (!response.ERROR) {
        ownerName = response.USER.FULL_NAME;
    }

    createElement("td", row, ownerName, 
    [
        {"name": "onclick", "value": "showClubTab(" + club.ID + ")"}
    ]);

    createElement("td", row, club.ADDRESS, 
    [
        {"name": "onclick", "value": "showClubTab(" + club.ID + ")"}
    ]);

    if (loggedUser.RULE_ID < 2 || owner) {
        createElement("td", row, "<img src='/images/editIcon48.png'>",
        [
            {"name": "class", "value": "smallCell"},
            {"name": "onclick", "value": "editClubTab(" + club.ID + ")"}
        ]);

        createElement("td", row, "<img src='/images/deleteIcon48.png'>",
        [
            {"name": "class", "value": "smallCellLast"},
            {"name": "onclick", "value": "deleteClub(" + club.ID + ")"}
        ]);
    }
}

function createClubHeaderRow(owner) {
    var row = createElement("tr", clubTable);
    createElement("th", row, "Name");
    createElement("th", row, "Country");
    createElement("th", row, "Owner");
    createElement("th", row, "Address");
    if (loggedUser.RULE_ID < 2 || owner) {
        createElement("th", row);
        createElement("th", row);
    }
}