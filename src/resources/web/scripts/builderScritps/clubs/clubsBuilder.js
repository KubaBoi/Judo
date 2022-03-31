var clubTable;

async function buildClubTable() {
    clubTable = document.getElementById("clubTable");

    newContent("clubsDiv");

    var response = await callEndpoint("GET", "/clubs/getClubs" + createClubFilters());
    if (!response.ERROR) {
        clubTable.innerHTML = "";
        createClubHeaderRow();
        for (var i = 0; i < response.CLUBS.length; i++) {
            buildClubRow(response.CLUBS[i]);
        }
    } 
    else if (response.ERROR != "No cookies") {
        showAlert("An error occurred :(", response.ERROR);
    }
}

function createClubFilters() {
    var filter = "";

    var searchInput = document.getElementById("clubSearchInp");
    var searchType = document.getElementById("typeClubSearchInp");
    if (searchType.value == 0) {
        filter += "?title=" + searchInput.value;
        filter += "&city=";
        filter += "&code=";
    }
    else if (searchType.value == 1) {
        filter += "?title="
        filter += "&city=";
        filter += "&code=" + searchInput.value;
    }
    else {
        filter += "?title="
        filter += "&city=" + searchInput.value;
        filter += "&code=";
    }

    filter += "&eju=";

    return filter;
}

function buildClubRow(club) {
    var row = createElement("tr", clubTable);
    createElement("td", row, club.TITLE, 
    [
        {"name": "onclick", "value": "showClubTab(" + club.ID + ")"}
    ]);

    createElement("td", row, club.STREET + ", " + club.CITY + ", " + club.ZIP, 
    [
        {"name": "onclick", "value": "showClubTab(" + club.ID + ")"}
    ]);
    
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

function createClubHeaderRow() {
    var row = createElement("tr", clubTable);
    createElement("th", row, "Title");
    createElement("th", row, "Address");
    createElement("th", row);
    createElement("th", row);
}