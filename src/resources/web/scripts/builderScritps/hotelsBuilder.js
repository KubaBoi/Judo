var hotelTable;
var hotels = [];
async function buildHotelTable() {
    hotelTable = document.getElementById("hotelTable");

    newContent("hotelsDiv");

    var response = await callEndpoint("GET", "/hotels/getHotels" + createFilters());
    if (!response.ERROR) {
        hotels = response.HOTELS[i];
        hotelTable.innerHTML = "";
        createHeaderRow();
        for (var i = 0; i < response.HOTELS.length; i++) {
            buildHotelRow(response.HOTELS[i]);
        }
    } 
    else if (response.ERROR != "No cookies") {
        showAlert("An error occurred :(", response.ERROR);
    }
}

function createFilters() {
    var filter = "";

    var searchInput = document.getElementById("hotelSearchInp");
    var searchType = document.getElementById("typeSearchInp");
    if (searchType.value == 0) {
        filter += "?title=" + searchInput.value;
        filter += "&city=";
    }
    else {
        filter += "?title="
        filter += "&city=" + searchInput.value;;
    }

    if (document.getElementById("1bed").checked) filter += "&oneBed=true";
    else filter += "&oneBed=false";

    if (document.getElementById("2bed").checked) filter += "&twoBed=true";
    else filter += "&twoBed=false";

    if (document.getElementById("3bed").checked) filter += "&threeBed=true";
    else filter += "&threeBed=false";

    if (document.getElementById("4bed").checked) filter += "&fourBed=true";
    else filter += "&fourBed=false";

    return filter;
}

function buildHotelRow(hotel) {
    var row = createElement("tr", hotelTable);
    createElement("td", row, hotel.TITLE, 
    [
        {"name": "onclick", "value": "showHotelTab(" + hotel.ID + ")"}
    ]);

    createElement("td", row, hotel.STREET + ", " + hotel.CITY + ", " + hotel.ZIP, 
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

function createHeaderRow() {
    var row = document.createElement("tr");
    var titleColumn = createElement("th", row, "Title");
    var addressColumn = createElement("th", row, "Address");
    var editColumn = createElement("th", row);
    var removeColumn = createElement("th", row);

    hotelTable.appendChild(row);
}