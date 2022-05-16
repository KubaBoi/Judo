async function showRegistrationTab(hotelId) {

    var response = await callEndpoint("GET", "/hotels/get?id=" + hotelId);
    if (!response.ERROR) {
        activeHotel = response.HOTEL;
        var hiddenTab = openHiddenTab();

        createElement("h2", hiddenTab, activeHotel.NAME);
        var showDiv = createElement("div", hiddenTab, "",
        [
            {"name": "class", "value": "showTableDiv"}
        ]);

        var tbl = createElement("table", showDiv);

        createShowTableRow(tbl, "Name: ",  activeHotel.NAME);
        createShowTableRow(tbl, "Address: ", activeHotel.ADDRESS);
        createShowTableRow(tbl, "E-mail: ", activeHotel.MAIL);
        createShowTableRow(tbl, "Web: ", activeHotel.WEB);
        createShowTableRow(tbl, "Phone: ", activeHotel.PHONE);
        createShowTableRow(tbl, "Min. nights: ", activeHotel.P_NIGHTS);
        createShowTableRow(tbl, "Package: ", activeHotel.PACKAGE);

        var tblRooms = createElement("table", showDiv);

        createShowTableRowMulti(tblRooms, "Single", [activeHotel.ONE_ROOM, activeHotel.ONE_ROOM_PRICE]);
        createShowTableRowMulti(tblRooms, "Double", [activeHotel.TWO_ROOM, activeHotel.TWO_ROOM_PRICE]);
        createShowTableRowMulti(tblRooms, "Triple", [activeHotel.THREE_ROOM, activeHotel.THREE_ROOM_PRICE]);
        createShowTableRowMulti(tblRooms, "Apartman", [activeHotel.APARTMAN_ROOM, activeHotel.APARTMAN_ROOM_PRICE]);

    } 
    else if (response.ERROR != "No cookies") {
        showAlert("An error occurred :(", response.ERROR);
    }
}