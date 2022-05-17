async function showClubTab(clubId) {
    var response = await callEndpoint("GET", "/clubs/getClub?clubId=" + clubId);
    if (!response.ERROR) {
        activeClub = response.CLUB;
        var hiddenTab = openHiddenTab();

        var hdr = createElement("h2", hiddenTab, activeClub.TITLE);
        var showDiv = createElement("div", hiddenTab, "",
        [
            {"name": "class", "value": "showTableDiv"}
        ]);

        var tbl = createElement("table", showDiv);

        createShowTableRow(tbl, "Street: ",  activeClub.STREET);
        createShowTableRow(tbl, "Code: ", activeClub.CODE);
        createShowTableRow(tbl, "City: ", activeClub.CITY);
        createShowTableRow(tbl, "ZIP: ", activeClub.ZIP);
        createShowTableRow(tbl, "E-mail: ", activeClub.EMAIL);
        createShowTableRow(tbl, "Phone: ", activeClub.PHONE);
        createShowTableRow(tbl, "Web: ", activeClub.WEB);
    } 
    else if (response.ERROR != "No cookies") {
        showAlert("An error occurred :(", response.ERROR);
    }
}