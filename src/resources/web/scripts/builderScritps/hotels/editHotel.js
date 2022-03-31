var activeHotel;
async function editHotelTab(hotelId) {
    var response = null;
    if (hotelId != null) {
        response = await callEndpoint("GET", "/hotels/getRooms?hotelId=" + hotelId);
    }
    else {
        response = {
            "HOTEL": {
                "TITLE": "",
                "STREET": "",
                "CITY": "",
                "ZIP": "",
                "EMAIL": "",
                "PHONE": "",
                "WEB": "",
                "ROOMS": []
            }
        }
    }

    if (!response.ERROR) {
        activeHotel = response.HOTEL;
        var hiddenTab = openHiddenTab();

        if (hotelId) createElement("h2", hiddenTab, "Edit hotel");
        else createElement("h2", hiddenTab, "Create new hotel");

        var editDiv = createElement("div", hiddenTab, "",
        [
            {"name": "class", "value": "editTableDiv"}
        ]);

        var tbl = createElement("table", editDiv);

        createEditTableRow(tbl, "Title: ", "titleInpEdit", activeHotel.TITLE);
        createEditTableRow(tbl, "Street: ", "streetInpEdit", activeHotel.STREET);
        createEditTableRow(tbl, "City: ", "cityInpEdit", activeHotel.CITY);
        createEditTableRow(tbl, "ZIP: ", "zipInpEdit", activeHotel.ZIP);
        createEditTableRow(tbl, "E-mail: ", "emailInpEdit", activeHotel.EMAIL);
        createEditTableRow(tbl, "Phone: ", "phoneInpEdit", activeHotel.PHONE);
        createEditTableRow(tbl, "Web: ", "webInpEdit", activeHotel.WEB);

        var tblRooms = createElement("table", editDiv);

        var roomHeader = createElement("tr", tblRooms);
        createElement("th", roomHeader, "Rooms");
        createElement("th", roomHeader, "Number of rooms");
        createElement("th", roomHeader, "Room Only (€)");
        createElement("th", roomHeader, "Bed and Breakfast (€)");
        createElement("th", roomHeader, "Half board (€)");
        createElement("th", roomHeader, "Full board (€)");

        for (let i = 1; i < 5; i++) {
            createEditTableRowRooms(tblRooms, findRoom(i));
        }

        createElement("button", hiddenTab, "Save changes", 
        [
            {"name": "class", "value": "rightButton"},
            {"name": "onclick", "value": "saveHotelChanges(" + hotelId + ")"}
        ]);
    } 
    else if (response.ERROR != "No cookies") {
        showAlert("An error occurred :(", response.ERROR);
    }
}

function findRoom(bed) {
    for (let i = 0; i < activeHotel.ROOMS.length; i++) {
        if (activeHotel.ROOMS[i].BED == bed) {
            return activeHotel.ROOMS[i];
        }
    }
    return {
        "BED": bed,
        "COUNT": 0,
        "HOTEL_ID": activeHotel.ID,
        "ID": null,
        "PRICE_RO": 0,
        "PRICE_BB": 0,
        "PRICE_HB": 0,
        "PRICE_FB": 0
    };
}

function createEditTableRow(tbl, label, id, defValue) {
    var row = createElement("tr", tbl);
    createElement("td", row, label);
    var value = createElement("td", row);
    createEditTableInput(value, id, defValue);
}

function createEditTableRowRooms(tbl, room) {
    var row = createElement("tr", tbl);
    createElement("td", row, room.BED + "-bed room");

    var count = createElement("td", row);
    createEditTableInput(count, "countInp" + room.BED, room.COUNT);

    var priceRO = createElement("td", row);
    createEditTableInput(priceRO, "priceROInp" + room.BED, room.PRICE_RO);
    
    var priceBB = createElement("td", row);
    createEditTableInput(priceBB, "priceBBInp" + room.BED, room.PRICE_BB);

    var priceHB = createElement("td", row);
    createEditTableInput(priceHB, "priceHBInp" + room.BED, room.PRICE_HB);

    var priceFB = createElement("td", row);
    createEditTableInput(priceFB, "priceFBInp" + room.BED, room.PRICE_FB);
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

async function saveHotelChanges(hotelId, hardCreate="false") {
    var response = null;
    if (hotelId) {
        var request = {
            "HOTEL": prepareHotelChangedData()
        }
        response = await callEndpoint("POST", "/hotels/updateHotel", request);
    }
    else {
        var request = {
            "HARD_CREATE": hardCreate,
            "HOTEL": prepareHotelChangedData()
        }
        response = await callEndpoint("POST", "/hotels/createHotel", request);
    }
    if (!response.ERROR) {
        if (hotelId) {
            buildHotelTable();
            showAlert("Success :)", "Hotel was updated");
        }
        else {
            console.log(response);
            if (response.STATUS == "OK") {
                buildHotelTable();
                showAlert("Success :)", "Hotel was created");
            }
            else {
                showConfirm("Existing hotel",
                    "Hotel with this title already exists. Do you still wanna create new one?",
                    function() {saveHotelChanges(null, "true")});
            }
        }
    }
    else {
        showAlert("An error occurred :(", response.ERROR);
    }
}

function prepareHotelChangedData() {
    var newHotel = {
        "ID": activeHotel.ID,
        "TITLE": getValueOf("titleInpEdit"),
        "STREET": getValueOf("streetInpEdit"),
        "CITY": getValueOf("cityInpEdit"),
        "ZIP": getValueOf("zipInpEdit"),
        "EMAIL": getValueOf("emailInpEdit"),
        "PHONE": getValueOf("phoneInpEdit"),
        "WEB": getValueOf("webInpEdit"),
        "ROOMS": prepareChangedRooms()
    }
    return newHotel;
}

function prepareChangedRooms() {
    rooms = [];
    for (let i = 1; i < 5; i++) {
        room = findRoom(i);
        rooms.push(
            {
                "ID": room.ID,
                "BED": i,
                "HOTEL_ID": room.HOTEL_ID,
                "COUNT": getValueOf("countInp" + i),
                "PRICE_RO": getValueOf("priceROInp" + i),
                "PRICE_BB": getValueOf("priceBBInp" + i),
                "PRICE_HB": getValueOf("priceHBInp" + i),
                "PRICE_FB": getValueOf("priceFBInp" + i),
            }
        );
    }
    return rooms;
}

function deleteHotel(hotelId) {
    showConfirm("Really?", 
        "Do you really want to delete this hotel?<br>Action is irreversible.",
        function() {reallyDeleteHotel(hotelId);});
}   

async function reallyDeleteHotel(hotelId) {
    var response = await callEndpoint("GET", "/hotels/deleteHotel?hotelId=" + hotelId);
    if (!response.ERROR) {
        showAlert("Success :)", "Hotel was deleted");
        buildHotelTable();
    }
    else {
        showAlert("An error occurred :(", response.ERROR);
    }
}