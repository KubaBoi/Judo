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
                "ONE_ROOM_BB": 0,
                "ONE_ROOM_HB": 0,
                "ONE_ROOM_FB": 0,
                "ONE_ROOM_LIV": 0,
                "TWO_ROOM": 0,
                "TWO_ROOM_PRICE": 0,
                "TWO_ROOM_BB": 0,
                "TWO_ROOM_HB": 0,
                "TWO_ROOM_FB": 0,
                "TWO_ROOM_LIV": 0,
                "THREE_ROOM": 0,
                "THREE_ROOM_PRICE": 0,
                "THREE_ROOM_BB": 0,
                "THREE_ROOM_HB": 0,
                "THREE_ROOM_FB": 0,
                "THREE_ROOM_LIV": 0,
                "APARTMAN_ROOM": 0,
                "APARTMAN_ROOM_PRICE": 0,
                "APARTMAN_ROOM_BB": 0,
                "APARTMAN_ROOM_HB": 0,
                "APARTMAN_ROOM_FB": 0,
                "APARTMAN_ROOM_LIV": 0
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
        createElement("th", roomHeader, "BB (€)", [{"name": "title", "value": "Bed and Breakfast"}]);
        createElement("th", roomHeader, "HB (€)", [{"name": "title", "value": "Half Board"}]);
        createElement("th", roomHeader, "FB (€)", [{"name": "title", "value": "Full Board"}]);
        createElement("th", roomHeader, "LIV (€)", [{"name": "title", "value": "Lunch In Venue"}]);

        
        createEditTableRowMulti(tblRooms, "Single", [
            {"id": "oneRoomCountInp", "defValue": activeHotel.ONE_ROOM, "type": "number"},
            {"id": "oneRoomPriceInp", "defValue": activeHotel.ONE_ROOM_PRICE, "type": "number"},
            {"id": "oneRoomBBInp", "defValue": activeHotel.ONE_ROOM_BB, "type": "number"},
            {"id": "oneRoomHBInp", "defValue": activeHotel.ONE_ROOM_HB, "type": "number"},
            {"id": "oneRoomFBInp", "defValue": activeHotel.ONE_ROOM_FB, "type": "number"},
            {"id": "oneRoomLIVInp", "defValue": activeHotel.ONE_ROOM_LIV, "type": "number"}
        ]);

        createEditTableRowMulti(tblRooms, "Double", [
            {"id": "twoRoomCountInp", "defValue": activeHotel.TWO_ROOM, "type": "number"},
            {"id": "twoRoomPriceInp", "defValue": activeHotel.TWO_ROOM_PRICE, "type": "number"},
            {"id": "twoRoomBBInp", "defValue": activeHotel.TWO_ROOM_BB, "type": "number"},
            {"id": "twoRoomHBInp", "defValue": activeHotel.TWO_ROOM_HB, "type": "number"},
            {"id": "twoRoomFBInp", "defValue": activeHotel.TWO_ROOM_FB, "type": "number"},
            {"id": "twoRoomLIVInp", "defValue": activeHotel.TWO_ROOM_LIV, "type": "number"}
        ]);

        createEditTableRowMulti(tblRooms, "Triple", [
            {"id": "threeRoomCountInp", "defValue": activeHotel.THREE_ROOM, "type": "number"},
            {"id": "threeRoomPriceInp", "defValue": activeHotel.THREE_ROOM_PRICE, "type": "number"},
            {"id": "threeRoomBBInp", "defValue": activeHotel.THREE_ROOM_BB, "type": "number"},
            {"id": "threeRoomHBInp", "defValue": activeHotel.THREE_ROOM_HB, "type": "number"},
            {"id": "threeRoomFBInp", "defValue": activeHotel.THREE_ROOM_FB, "type": "number"},
            {"id": "threeRoomLIVInp", "defValue": activeHotel.THREE_ROOM_LIV, "type": "number"}
        ]);

        createEditTableRowMulti(tblRooms, "Apartman", [
            {"id": "apartmanRoomCountInp", "defValue": activeHotel.APARTMAN_ROOM, "type": "number"},
            {"id": "apartmanRoomPriceInp", "defValue": activeHotel.APARTMAN_ROOM_PRICE, "type": "number"},
            {"id": "apartmanRoomBBInp", "defValue": activeHotel.APARTMAN_ROOM_BB, "type": "number"},
            {"id": "apartmanRoomHBInp", "defValue": activeHotel.APARTMAN_ROOM_HB, "type": "number"},
            {"id": "apartmanRoomFBInp", "defValue": activeHotel.APARTMAN_ROOM_FB, "type": "number"},
            {"id": "apartmanRoomLIVInp", "defValue": activeHotel.APARTMAN_ROOM_LIV, "type": "number"}
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
    showLoader();

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

    hideLoader();
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
        "ONE_ROOM_BB": getValueOf("oneRoomBBInp"),
        "ONE_ROOM_HB": getValueOf("oneRoomHBInp"),
        "ONE_ROOM_FB": getValueOf("oneRoomFBInp"),
        "ONE_ROOM_LIV": getValueOf("oneRoomLIVInp"),
        "TWO_ROOM": getValueOf("twoRoomCountInp"),
        "TWO_ROOM_PRICE": getValueOf("twoRoomPriceInp"),
        "TWO_ROOM_BB": getValueOf("twoRoomBBInp"),
        "TWO_ROOM_HB": getValueOf("twoRoomHBInp"),
        "TWO_ROOM_FB": getValueOf("twoRoomFBInp"),
        "TWO_ROOM_LIV": getValueOf("twoRoomLIVInp"),
        "THREE_ROOM": getValueOf("threeRoomCountInp"),
        "THREE_ROOM_PRICE": getValueOf("threeRoomPriceInp"),
        "THREE_ROOM_BB": getValueOf("threeRoomBBInp"),
        "THREE_ROOM_HB": getValueOf("threeRoomHBInp"),
        "THREE_ROOM_FB": getValueOf("threeRoomFBInp"),
        "THREE_ROOM_LIV": getValueOf("threeRoomLIVInp"),
        "APARTMAN_ROOM": getValueOf("apartmanRoomCountInp"),
        "APARTMAN_ROOM_PRICE": getValueOf("apartmanRoomPriceInp"),
        "APARTMAN_ROOM_BB": getValueOf("apartmanRoomBBInp"),
        "APARTMAN_ROOM_HB": getValueOf("apartmanRoomHBInp"),
        "APARTMAN_ROOM_FB": getValueOf("apartmanRoomFBInp"),
        "APARTMAN_ROOM_LIV": getValueOf("apartmanRoomLIVInp")
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