var activeClub;
async function editClubTab(clubId) {
    var response = null;
    if (clubId != null) {
        response = await callEndpoint("GET", "/clubs/getClub?clubId=" + clubId);
    }
    else {
        response = {
            "CLUB": {
                "TITLE": "",
                "CODE": "",
                "EJU": "",
                "STREET": "",
                "CITY": "",
                "ZIP": "",
                "EMAIL": "",
                "PHONE": "",
                "WEB": ""
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

        createEditTableRow(tbl, "Title: ", "titleInpEdit", activeClub.TITLE);
        createEditTableRow(tbl, "Code: ", "codeInpEdit", activeClub.CODE);
        createEditTableRow(tbl, "Street: ", "streetInpEdit", activeClub.STREET);
        createEditTableRow(tbl, "City: ", "cityInpEdit", activeClub.CITY);
        createEditTableRow(tbl, "ZIP: ", "zipInpEdit", activeClub.ZIP);
        createEditTableRow(tbl, "E-mail: ", "emailInpEdit", activeClub.EMAIL);
        createEditTableRow(tbl, "Phone: ", "phoneInpEdit", activeClub.PHONE);
        createEditTableRow(tbl, "Web: ", "webInpEdit", activeClub.WEB);

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

function createEditTableRow(tbl, label, id, defValue) {
    var row = createElement("tr", tbl);
    createElement("td", row, label);
    var value = createElement("td", row);
    createEditTableInput(value, id, defValue);
}

function createEditTableInput(parent, id, defValue) {
    if (defValue == 0) defValue = "";

    var input = createElement("input", parent, "", 
    [
        {"name": "id", "value": id},
        {"name": "type", "value": "text"},
        {"name": "value", "value": defValue},
        {"name": "class", "value": "textBox"}
    ]);
    return input;
}

async function saveClubChanges(clubId, hardCreate="false") {
    var response = null;
    if (clubId) {
        var request = {
            "CLUB": prepareChangedData()
        }
        response = await callEndpoint("POST", "/clubs/updateClub", request);
    }
    else {
        var request = {
            "HARD_CREATE": hardCreate,
            "CLUB": prepareChangedData()
        }
        response = await callEndpoint("POST", "/clubs/createClub", request);
    }
    if (!response.ERROR) {
        if (clubId) {
            buildClubTable();
            showAlert("Success :)", "Club was updated");
        }
        else {
            console.log(response);
            if (response.STATUS == "OK") {
                buildClubTable();
                showAlert("Success :)", "Club was created");
            }
            else {
                showConfirm("Existing club",
                    "Club with this title already exists. Do you still wanna create new one?",
                    function() {saveClubChanges(null, "true")});
            }
        }
    }
    else {
        showAlert("An error occurred :(", response.ERROR);
    }
}

function prepareChangedData() {
    var newClub = {
        "ID": activeClub.ID,
        "TITLE": getValueOf("titleInpEdit"),
        "CODE": getValueOf("codeInpEdit"),
        "EJU": getValueOf("ejuInpEdit"),
        "STREET": getValueOf("streetInpEdit"),
        "CITY": getValueOf("cityInpEdit"),
        "ZIP": getValueOf("zipInpEdit"),
        "EMAIL": getValueOf("emailInpEdit"),
        "PHONE": getValueOf("phoneInpEdit"),
        "WEB": getValueOf("webInpEdit")
    }
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