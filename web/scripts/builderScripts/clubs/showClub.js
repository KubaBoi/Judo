async function showClubTab(clubId) {
    var response = await callEndpoint("GET", "/clubs/get?clubId=" + clubId);
    if (!response.ERROR) {
        activeClub = response.CLUB;
        var hiddenTab = openHiddenTab();

        var hdr = createElement("h2", hiddenTab, activeClub.TITLE);
        var showDiv = createElement("div", hiddenTab, "",
        [
            {"name": "class", "value": "showTableDiv"}
        ]);

        var tbl = createElement("table", showDiv);

        createShowTableRow(tbl, "Name: ",  activeClub.NAME);
        createShowTableRow(tbl, "State: ", activeClub.STATE);
        createShowTableRow(tbl, "Address: ", activeClub.ADDRESS);
        createShowTableRow(tbl, "EJU: ", activeClub.EJU);
    } 
    else if (response.ERROR != "No cookies") {
        showErrorAlert(response.ERROR, alertTime);
    }
}