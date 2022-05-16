var hotelTable;

async function buildRegistrationsTable() {
    hotelTable = document.getElementById("hotelTable");

    newContent("hotelsDiv");

    var response = await callEndpoint("GET", "/hotels/getAll");
    if (!response.ERROR) {
        hotelTable.innerHTML = "";
        createHotelHeaderRow();
        for (var i = 0; i < response.HOTELS.length; i++) {
            buildHotelRow(response.HOTELS[i]);
        }
    } 
    else if (response.ERROR != "No cookies") {
        showAlert("An error occurred :(", response.ERROR);
    }
}

function buildHotelRow(hotel) {
    var row = createElement("tr", hotelTable);
    createElement("td", row, hotel.NAME, 
    [
        {"name": "onclick", "value": "showHotelTab(" + hotel.ID + ")"}
    ]);

    createElement("td", row, hotel.ADDRESS, 
    [
        {"name": "onclick", "value": "showHotelTab(" + hotel.ID + ")"}
    ]);
    
    createElement("td", row, "<img src='/images/editIcon48.png'>",
    [
        {"name": "class", "value": "smallCell"},
        {"name": "onclick", "value": "editHotelTab(" + hotel.ID + ")"}
    ]);

    createElement("td", row, "<img src='/images/deleteIcon48.png'>",
    [
        {"name": "class", "value": "smallCellLast"},
        {"name": "onclick", "value": "deleteHotel(" + hotel.ID + ")"}
    ]);
}

function createHotelHeaderRow() {
    var row = createElement("tr", hotelTable);
    createElement("th", row, "Name");
    createElement("th", row, "Address");
    createElement("th", row);
    createElement("th", row);
}