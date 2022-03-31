async function showHotelTab(hotelId) {
    var response = await callEndpoint("GET", "/hotels/getRooms?hotelId=" + hotelId);
    if (!response.ERROR) {
        activeHotel = response.HOTEL;
        var hiddenTab = openHiddenTab();

        var hdr = createElement("h2", hiddenTab, activeHotel.TITLE);
        var showDiv = createElement("div", hiddenTab, "",
        [
            {"name": "class", "value": "showTableDiv"}
        ]);

        var tbl = createElement("table", showDiv);

        createShowTableRow(tbl, "Street: ",  activeHotel.STREET);
        createShowTableRow(tbl, "City: ", activeHotel.CITY);
        createShowTableRow(tbl, "ZIP: ", activeHotel.ZIP);
        createShowTableRow(tbl, "E-mail: ", activeHotel.EMAIL);
        createShowTableRow(tbl, "Phone: ", activeHotel.PHONE);
        createShowTableRow(tbl, "Web: ", activeHotel.WEB);

        var tblRooms = createElement("table", showDiv);

        var roomHeader = createElement("tr", tblRooms);
        createElement("th", roomHeader, "Rooms");
        createElement("th", roomHeader, "Number of rooms");
        createElement("th", roomHeader, "Room Only");
        createElement("th", roomHeader, "Bed and Breakfast");
        createElement("th", roomHeader, "Half board");
        createElement("th", roomHeader, "Full board");

        for (let i = 1; i < 5; i++) {
            createShowTableRowRooms(tblRooms, findRoom(i));
        }

    } 
    else if (response.ERROR != "No cookies") {
        showAlert("An error occurred :(", response.ERROR);
    }
}

function createShowTableRow(tbl, label, defValue) {
    var row = createElement("tr", tbl);
    createElement("td", row, label);
    createElement("td", row, defValue);
}

function createShowTableRowRooms(tbl, room) {
    var row = createElement("tr", tbl);
    createElement("td", row, room.BED + "-bed room");

    createElement("td", row, room.COUNT);

    createElement("td", row, room.PRICE_RO + " €");    
    createElement("td", row, room.PRICE_BB + " €");
    createElement("td", row, room.PRICE_HB + " €");
    createElement("td", row, room.PRICE_FB + " €");
}