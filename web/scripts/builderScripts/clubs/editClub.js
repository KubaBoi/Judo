var activeClub;
async function editClubTab(clubId) {
    showLoader();
    var response = null;
    if (clubId != null) {
        response = await callEndpoint("GET", "/clubs/get?clubId=" + clubId);
    }
    else {
        response = {
            "CLUB": {
                "ID": "",
                "STATE": "",
                "NAME": "",
                "ADDRESS": "",
                "EJU": "",
                "USER_ID": ""
            }
        }
    }

    if (!response.ERROR) {
        activeClub = response.CLUB;
        var hiddenTab = getHiddenTab();

        if (clubId) createElement("h2", hiddenTab, "Edit club");
        else createElement("h2", hiddenTab, "Create new club");

        var editDiv = createElement("div", hiddenTab, "",
        [
            {"name": "class", "value": "editTableDiv"}
        ]);

        var tbl = createElement("table", editDiv);

        createEditTableRow(tbl, "Name: ", "nameInpEdit", activeClub.NAME);
        createEditTableRow(tbl, "State: ", "stateInpEdit", activeClub.STATE);
        createEditTableRow(tbl, "Address: ", "addressInpEdit", activeClub.ADDRESS);
        createEditTableRow(tbl, "EJU: ", "ejuInpEdit", activeClub.EJU, "checkbox");

        createElement("button", hiddenTab, "Save changes", 
        [
            {"name": "class", "value": "rightButton"},
            {"name": "onclick", "value": "saveClubChanges(" + clubId + ")"}
        ]);
        openHiddenTab();
    } 
    else if (response.ERROR != "No cookies") {
        showErrorAlert(response.ERROR, alertTime);
    }

    hideLoader();
}

async function saveClubChanges(clubId) {
    var response = null;
    if (clubId) {
        var request = prepareClubChangedData();
        response = await callEndpoint("POST", "/clubs/update", request);
    }
    else {
        var request = prepareClubChangedData();
        response = await callEndpoint("POST", "/clubs/create", request);
    }
    if (response.ERROR == null) {
        if (clubId) {
            buildClubTable();
            showAlert("Success :)", "Club was updated");
            response = await callEndpoint("GET", `/clubs/get?clubId=${clubId}`);
        }
        else {
            buildClubTable();
            showAlert("Success :)", "Club was created");
            response = await callEndpoint("GET", `/clubs/get?clubId=${response.CLUB_ID}`);
        }

        if (response.ERROR == null) {
            loggedClub = response.CLUB;
        }
        else {
            showErrorAlert(response.ERROR, alertTime);
        }
    }
    else {
        showErrorAlert(response.ERROR, alertTime);
    }
}

function prepareClubChangedData() {
    var newClub = {
        "ID": activeClub.ID,
        "NAME": getValueOf("nameInpEdit"),
        "STATE": getValueOf("stateInpEdit"),
        "ADDRESS": getValueOf("addressInpEdit"),
        "EJU": getValueOf("ejuInpEdit"),
        "USER_ID": (!activeClub.USER_ID) ? loggedUser.ID : activeClub.USER_ID,
    };
    return newClub;
}

function deleteClub(clubId) {
    showConfirm("Really?", 
        "Do you really want to delete this club?<br>Action is irreversible.",
        function() {reallyDeleteClub(clubId);});
}   

async function reallyDeleteClub(clubId) {
    var response = await callEndpoint("GET", "/clubs/deleteClub?clubId=" + clubId);
    if (!response.ERROR) {
        showAlert("Success :)", "Club was deleted");
        loggedClub = null;
        buildClubTable();
    }
    else {
        showErrorAlert(response.ERROR, alertTime);
    }
}