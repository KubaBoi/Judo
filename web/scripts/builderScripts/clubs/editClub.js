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

        let selectInp = createElementFromHTML(countryCodes);
        addRow(tbl, [
            {"text": "Country"},
            {"text": `<div class="custom-select">${selectInp.outerHTML}</div>`}
        ]);
        if (activeClub.STATE != "") {
            document.getElementById("stateInpEdit").value = activeClub.STATE;
        }
        try {
            prepareSelect();
        }
        catch {
            document.getElementById("stateInpEdit").value = "CZE";
            prepareSelect();
        }
        
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
            showOkAlert("Success :)", "Club was updated", alertTime);
            closeHiddenTab();
        }
        else {
            buildClubTable();
            showOkAlert("Success :)", "Club was created", alertTime);
            closeHiddenTab();
        }

        await loadClubs();
        activeClub = loggedClub;
    }
    else {
        showErrorAlert(response.ERROR, alertTime);
    }
}

function prepareClubChangedData() {
    var newClub = {
        "ID": activeClub.ID,
        "NAME": getValueOf("nameInpEdit"),
        "STATE": document.getElementById("stateInpEdit").value,
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
    var response = await callEndpoint("POST", "/clubs/remove", {"CLUB_ID": clubId});
    if (response.ERROR == null) {
        showAlert("Success :)", "Club was deleted");
        loggedClub = null;
        buildClubTable();
    }
    else {
        showErrorAlert(response.ERROR, alertTime);
    }
}