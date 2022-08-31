var activeEvent;

var hotelsEventEd = [];
var allHotelsTableEventEd = null;
var chosenHotelsTableEventEd = null;

async function editEventTab(eventId) {
    showLoader();
    var response = null;
    if (eventId != null) {
        response = await callEndpoint("GET", "/events/get?eventId=" + eventId);
    }
    else {
        response = {
            "EVENT": {
                "ID": "",
                "NAME": "",
                "CATEGORY": "",
                "PLACE": "",
                "START": getTime(),
                "END": getTime(),
                "ARRIVE": getTime(),
                "DEPART": getTime(),
                "END_VISA": getTime(),
                "END_ROOM": getTime(),
                "ORGANISER_ID": "",
                "VISA_MAIL": "",
                "VISA_PHONE": "",
                "EJU_PRICE": 0,
                "PCR_PRICE": 0,
                "AG_PRICE": 0,
                "TRANS_PRICE": 0,
                "OTHER_PRICE": 0,
                "SHOW_HOTEL": false
            }
        }
    }

    if (!response.ERROR) {
        activeEvent = response.EVENT;
        var hiddenTab = getHiddenTab();

        if (eventId) createElement("h2", hiddenTab, "Edit event");
        else createElement("h2", hiddenTab, "Create new event");

        var editDiv = createElement("div", hiddenTab, "",
        [
            {"name": "class", "value": "editTableDiv"}
        ]);

        var tbl = createElement("table", editDiv);

        createEditTableRow(tbl, "Name: ", "nameInpEdit", activeEvent.NAME);
        createEditTableRow(tbl, "Category: ", "categInpEdit", activeEvent.CATEGORY);
        createEditTableRow(tbl, "Place: ", "placeInpEdit", activeEvent.PLACE);
        createEditTableRow(tbl, "E-mail for visa: ", "visaMailInpEdit", activeEvent.VISA_MAIL);
        createEditTableRow(tbl, "Phone for visa: ", "visaPhoneInpEdit", activeEvent.VISA_PHONE);
        createEditTableRow(tbl, "EJU price: ", "ejuPriceInpEdit", activeEvent.EJU_PRICE, "number");
        createEditTableRow(tbl, "PCR tests price: ", "pcrPriceInpEdit", activeEvent.PCR_PRICE, "number");
        createEditTableRow(tbl, "Antigen tests price: ", "agPriceInpEdit", activeEvent.AG_PRICE, "number");
        createEditTableRow(tbl, "Transport price: ", "transPriceInpEdit", activeEvent.TRANS_PRICE, "number");
        createEditTableRow(tbl, "Other prices: ", "otherPriceInpEdit", activeEvent.OTHER_PRICE, "number");
        createEditTableRow(tbl, "Show hotel to clients: ", "showHotelInpEdit", activeEvent.SHOW_HOTEL, "checkbox");

        var dateTbl = createElement("table", editDiv);

        createEditTableRow(dateTbl, "Start: ", "startInpEdit", activeEvent.EVENT_START, "datetime-local");
        createEditTableRow(dateTbl, "End: ", "endInpEdit", activeEvent.EVENT_END, "datetime-local");
        createEditTableRow(dateTbl, "Arrive: ", "arriveInpEdit", activeEvent.ARRIVE, "datetime-local");
        createEditTableRow(dateTbl, "Departure: ", "departInpEdit", activeEvent.DEPART, "datetime-local");
        createEditTableRow(dateTbl, "Visa deadline: ", "visaEndInpEdit", activeEvent.END_VISA, "datetime-local");
        createEditTableRow(dateTbl, "Room deadline: ", "roomEndInpEdit", activeEvent.END_ROOM, "datetime-local");

        if (allHotelsTableEventEd != null) allHotelsTableEventEd.remove();
        allHotelsTableEventEd = createElement("table", editDiv);

        if (chosenHotelsTableEventEd != null) chosenHotelsTableEventEd.remove();
        chosenHotelsTableEventEd = createElement("table", editDiv);

        let chosenHotels = [];
        if (activeEvent.HOTELS != null) { 
            chosenHotels = activeEvent.HOTELS.split(",");
        }

        hotelsEventEd = [];

        var resp = await callEndpoint("GET", "/hotels/getAll");
        if (resp.ERROR == null) {
            let hotels = resp.HOTELS;
            for (let i = 0; i < hotels.length; i++) {
                let hotel = hotels[i];
                if (chosenHotels.includes(String(hotel.ID))) {
                    hotel.CHOSEN = true;
                    hotelsEventEd.push(hotel);
                }
                else {
                    hotel.CHOSEN = false;
                    hotelsEventEd.push(hotel);
                }
            }
        }
        else {
            showErrorAlert(resp.ERROR);
        }

        buildHotels();

        createElement("button", hiddenTab, "Save changes", 
        [
            {"name": "class", "value": "rightButton"},
            {"name": "onclick", "value": "saveEventChanges(" + eventId + ")"}
        ]);
        openHiddenTab();
    } 
    else if (response.ERROR != "No cookies") {
        showErrorAlert(response.ERROR);
    }

    hideLoader();
}

function buildHotels() {
    clearTable(chosenHotelsTableEventEd);
    clearTable(allHotelsTableEventEd);

    addHeader(chosenHotelsTableEventEd, [{"text": "Chosen hotels"}]);
    addHeader(allHotelsTableEventEd, [{"text": "All hotels"}]);

    for (let i = 0; i < hotelsEventEd.length; i++) {
        let hotel = hotelsEventEd[i];
        if (hotel.CHOSEN) {
            addRow(chosenHotelsTableEventEd, [
                {"text": hotel.NAME, "attributes": 
                    [{"name": "ondblclick", "value": `chooseHotel(${i}, false)`}]
                }
            ]);
        }
        else {
            addRow(allHotelsTableEventEd, [
                {"text": hotel.NAME, "attributes": 
                    [{"name": "ondblclick", "value": `chooseHotel(${i}, true)`}]
                }
            ]);
        }
    }
}

function chooseHotel(index, value) {
    hotelsEventEd[index].CHOSEN = value;
    buildHotels();
}   

async function saveEventChanges(eventId, hardCreate=false) {
    var response = null;
    if (eventId != null) {
        var request = prepareEventChangedData(hardCreate)
        response = await callEndpoint("POST", "/events/update", request);
    }
    else {
        var request = prepareEventChangedData(hardCreate)
        response = await callEndpoint("POST", "/events/create", request);
    }
    if (response.ERROR == null) {
        if (eventId != null) {
            buildEventTable();
            showTimerAlert("Success :)", "Event has been updated", alertTime, "divOkAlert",
                {"name": "okShowAlert", "duration": "0.5s"},
                {"name": "okHideAlert", "duration": "0.5s"}
            );
            closeHiddenTab();
        }
        else {
            buildEventTable();
            showTimerAlert("Success :)", "Event has been created", alertTime, "divOkAlert",
                {"name": "okShowAlert", "duration": "0.5s"},
                {"name": "okHideAlert", "duration": "0.5s"}
            );
            closeHiddenTab();
        }
    }
    else {
        if (response.ERROR == "Event already exists") {
            showConfirm("Existing event",
                "Event with this name already exists. Do you still wanna create a new one?",
                function() {saveEventChanges(null, true)});
        }
        else {
            showErrorAlert(response.ERROR);
        }
    }
}

function prepareEventChangedData(hardCreate) {
    let hotelsArr = "";
    for (let i = 0; i < hotelsEventEd.length; i++) {
        let hotel = hotelsEventEd[i];
        if (hotel.CHOSEN) {
            hotelsArr += String(hotel.ID) + ",";
        }
    }

    if (hotelsArr.endsWith(",")) {
        hotelsArr = hotelsArr.substring(0, hotelsArr.length - 1);
    }

    var newEvent = {
        "HARD_CREATE": hardCreate,
        "ID": activeEvent.ID,
        "NAME": getValueOf("nameInpEdit"),
        "CATEGORY": getValueOf("categInpEdit"),
        "PLACE": getValueOf("placeInpEdit"),
        "EVENT_START": getValueOf("startInpEdit"),
        "EVENT_END": getValueOf("endInpEdit"),
        "ARRIVE": getValueOf("arriveInpEdit"),
        "DEPART": getValueOf("departInpEdit"),
        "END_VISA": getValueOf("visaEndInpEdit"),
        "END_ROOM": getValueOf("roomEndInpEdit"),
        "ORGANISER_ID": loggedUser.ID,
        "VISA_MAIL": getValueOf("visaMailInpEdit"),
        "VISA_PHONE": getValueOf("visaPhoneInpEdit"),
        "EJU_PRICE": getValueOf("ejuPriceInpEdit"),
        "PCR_PRICE": getValueOf("pcrPriceInpEdit"),
        "AG_PRICE": getValueOf("agPriceInpEdit"),
        "TRANS_PRICE": getValueOf("transPriceInpEdit"),
        "OTHER_PRICE": getValueOf("otherPriceInpEdit"),
        "SHOW_HOTEL": getValueOf("showHotelInpEdit"),
        "HOTELS": hotelsArr
    }
    return newEvent;
}

function deleteEvent(eventId) {
    showConfirm("Really?", 
        "Do you really want to delete this event?<br>Action is irreversible.",
        function() {reallyDeleteEvent(eventId);});
}   

async function reallyDeleteEvent(eventId) {
    var response = await callEndpoint("POST", "/events/remove", {"EVENT_ID": eventId});
    if (!response.ERROR) {
        showTimerAlert("Success :)", "Event has been deleted", alertTime, "divOkAlert",
                {"name": "okShowAlert", "duration": "0.5s"},
                {"name": "okHideAlert", "duration": "0.5s"}
            );
        buildEventTable();
    }
    else {
        showErrorAlert(response.ERROR, alertTime);
    }
}