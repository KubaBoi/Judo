async function showClubTab(clubId) {
    showLoader();
    var response = await callEndpoint("GET", "/clubs/get?clubId=" + clubId);
    if (!response.ERROR) {
        activeClub = response.CLUB;
        var hiddenTab = getHiddenTab();

        createElement("h2", hiddenTab, activeClub.TITLE);
        var showDiv = createElement("div", hiddenTab, "",
        [
            {"name": "class", "value": "showTableDiv"}
        ]);

        var tbl = createElement("table", showDiv);

        createShowTableRow(tbl, "Name: ",  activeClub.NAME);
        createShowTableRow(tbl, "Country: ", activeClub.STATE);
        createShowTableRow(tbl, "Address: ", activeClub.ADDRESS);
        createShowTableRow(tbl, "EJU: ", activeClub.EJU);

        openHiddenTab();
    } 
    else if (response.ERROR != "No cookies") {
        showErrorAlert(response.ERROR, alertTime);
    }

    hideLoader();
}