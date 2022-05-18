var activeHotel;
async function editHotelTab(hotelId) {
    showLoader();
    var response = null;
    if (hotelId != null) {
        response = await callEndpoint("GET", "/hotels/get?hotelId=" + hotelId);
    }
    else {
        response = {
            "HOTEL": {
                "ID": null,
                "NAME": "",
                "ADDRESS": "",
                "MAIL": "",
                "WEB": "",
                "PHONE": "",
                "PACKAGE": false,
                "P_NIGHTS": "",
                "ONE_ROOM": 0,
                "ONE_ROOM_PRICE": 0,
                "TWO_ROOM": 0,
                "TWO_ROOM_PRICE": 0,
                "THREE_ROOM": 0,
                "THREE_ROOM_PRICE": 0,
                "APARTMAN_ROOM": 0,
                "APARTMAN_ROOM_PRICE": 0
            }
        }
    }

    if (!response.ERROR) {
        activeHotel = response.HOTEL;
        var hiddenTab = getHiddenTab();

        if (hotelId != null) createElement("h2", hiddenTab, "Edit hotel");
        else createElement("h2", hiddenTab, "Create new hotel");

        var editDiv = createElement("div", hiddenTab, "",
        [
            {"name": "class", "value": "editTableDiv"}
        ]);

        var tbl = createElement("table", editDiv);

        createEditTableRow(tbl, "Name: ", "nameInpEdit", activeHotel.NAME);
        createEditTableRow(tbl, "Address: ", "addressInpEdit", activeHotel.ADDRESS);
        createEditTableRow(tbl, "E-mail: ", "mailInpEdit", activeHotel.MAIL);
        createEditTableRow(tbl, "Web: ", "webInpEdit", activeHotel.WEB);
        createEditTableRow(tbl, "Phone: ", "phoneInpEdit", activeHotel.PHONE);
        createEditTableRow(tbl, "Min. nights: ", "pnightsInpEdit", activeHotel.P_NIGHTS);
        createEditTableRow(tbl, "Package: ", "packageInpEdit", activeHotel.PACKAGE, "checkbox");

        var tblRooms = createElement("table", editDiv);

        var roomHeader = createElement("tr", tblRooms);
        createElement("th", roomHeader, "");
        createElement("th", roomHeader, "Count of rooms");
        createElement("th", roomHeader, "Price (€)");

        
        createEditTableRowMulti(tblRooms, "Single", [
            {"id": "oneRoomCountInp", "defValue": activeHotel.ONE_ROOM, "type": "number"},
            {"id": "oneRoomPriceInp", "defValue": activeHotel.ONE_ROOM_PRICE, "type": "number"}
        ]);

        createEditTableRowMulti(tblRooms, "Double", [
            {"id": "twoRoomCountInp", "defValue": activeHotel.TWO_ROOM, "type": "number"},
            {"id": "twoRoomPriceInp", "defValue": activeHotel.TWO_ROOM_PRICE, "type": "number"}
        ]);

        createEditTableRowMulti(tblRooms, "Triple", [
            {"id": "threeRoomCountInp", "defValue": activeHotel.THREE_ROOM, "type": "number"},
            {"id": "threeRoomPriceInp", "defValue": activeHotel.THREE_ROOM_PRICE, "type": "number"}
        ]);

        createEditTableRowMulti(tblRooms, "Apartman", [
            {"id": "apartmanRoomCountInp", "defValue": activeHotel.APARTMAN_ROOM, "type": "number"},
            {"id": "apartmanRoomPriceInp", "defValue": activeHotel.APARTMAN_ROOM_PRICE, "type": "number"}
        ]);

        createElement("button", hiddenTab, "Save changes", 
        [
            {"name": "class", "value": "rightButton"},
            {"name": "onclick", "value": "saveHotelChanges(" + hotelId + ")"}
        ]);

        openHiddenTab();
    } 
    else if (response.ERROR != "No cookies") {
        showErrorAlert(response.ERROR, alertTime);
    }

    hideLoader();
}

async function saveHotelChanges(hotelId, hardCreate=false) {
    var response = null;
    var request = prepareHotelChangedData(hardCreate);
    if (hotelId != null) {
        response = await callEndpoint("POST", "/hotels/update", request);
    }
    else {
        response = await callEndpoint("POST", "/hotels/create", request);
    }

    if (!response.ERROR) {
        if (hotelId != null) {
            buildHotelTable();
            showTimerAlert("Success :)", "Hotel was updated", alertTime, "divOkAlert",
                {"name": "okShowAlert", "duration": "0.5s"},
                {"name": "okHideAlert", "duration": "0.5s"}
            );
        }
        else {
            buildHotelTable();
            showTimerAlert("Success :)", "Hotel was created", alertTime, "divOkAlert",
                {"name": "okShowAlert", "duration": "0.5s"},
                {"name": "okHideAlert", "duration": "0.5s"}
            );
            closeHiddenTab();
        }
    }
    else if (response.ERROR == "Hotel already exists") {
        showConfirm("Existing hotel",
            "Hotel with this name already exists. Do you still wanna create a new one?",
            function() {saveHotelChanges(null, true)});
    }
    else {
        showErrorAlert(response.ERROR, alertTime);
    }
}

function prepareHotelChangedData(hardCreate) {
    var newHotel = {
        "HARD_CREATE": hardCreate,
        "ID": activeHotel.ID,
        "NAME": getValueOf("nameInpEdit"),
        "ADDRESS": getValueOf("addressInpEdit"),
        "MAIL": getValueOf("mailInpEdit"),
        "WEB": getValueOf("webInpEdit"),
        "PHONE": getValueOf("phoneInpEdit"),
        "PACKAGE": getValueOf("packageInpEdit"),
        "P_NIGHTS": getValueOf("pnightsInpEdit"),
        "ONE_ROOM": getValueOf("oneRoomCountInp"),
        "ONE_ROOM_PRICE": getValueOf("oneRoomPriceInp"),
        "TWO_ROOM": getValueOf("twoRoomCountInp"),
        "TWO_ROOM_PRICE": getValueOf("twoRoomPriceInp"),
        "THREE_ROOM": getValueOf("threeRoomCountInp"),
        "THREE_ROOM_PRICE": getValueOf("threeRoomPriceInp"),
        "APARTMAN_ROOM": getValueOf("apartmanRoomCountInp"),
        "APARTMAN_ROOM_PRICE": getValueOf("apartmanRoomPriceInp")
    }
    return newHotel;
}

function deleteHotel(hotelId) {
    showConfirm("Really?", 
        "Do you really want to delete this hotel?<br>Action is irreversible.",
        function() {reallyDeleteHotel(hotelId);});
}   

async function reallyDeleteHotel(hotelId) {
    var response = await callEndpoint("POST", "/hotels/remove?id=" + hotelId);
    if (!response.ERROR) {
        showTimerAlert("Success :)", "Hotel was deleted", alertTime, "divOkAlert",
            {"name": "okShowAlert", "duration": "0.5s"},
            {"name": "okHideAlert", "duration": "0.5s"}
        );
        buildHotelTable();
    }
    else {
        showErrorAlert(response.ERROR, alertTime);
    }
}