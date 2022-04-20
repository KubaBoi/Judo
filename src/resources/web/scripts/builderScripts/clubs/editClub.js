var activeClub;
async function editClubTab(clubId) {
    var response = null;
    if (clubId != null) {
        response = await callEndpoint("GET", "/clubs/get?id=" + clubId);
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
        var hiddenTab = openHiddenTab();

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
    } 
    else if (response.ERROR != "No cookies") {
        showAlert("An error occurred :(", response.ERROR);
    }
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
    if (!response.ERROR) {
        if (clubId) {
            buildClubTable();
            showAlert("Success :)", "Club was updated");
        }
        else {
            buildClubTable();
            showAlert("Success :)", "Club was created");
        }
    }
    else {
        showAlert("An error occurred :(", response.ERROR);
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
        buildClubTable();
    }
    else {
        showAlert("An error occurred :(", response.ERROR);
    }
}