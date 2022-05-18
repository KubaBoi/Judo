var activeEvent;
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
                "START": new Date().toISOString().slice(0,16),
                "END": new Date().toISOString().slice(0,16),
                "ARRIVE": new Date().toISOString().slice(0,16),
                "DEPART": new Date().toISOString().slice(0,16),
                "END_VISA": new Date().toISOString().slice(0,16),
                "END_ROOM": new Date().toISOString().slice(0,16),
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

        createEditTableRow(dateTbl, "Start: ", "startInpEdit", activeEvent.START, "datetime-local");
        createEditTableRow(dateTbl, "End: ", "endInpEdit", activeEvent.END, "datetime-local");
        createEditTableRow(dateTbl, "Arrive: ", "arriveInpEdit", activeEvent.ARRIVE, "datetime-local");
        createEditTableRow(dateTbl, "Departure: ", "departInpEdit", activeEvent.DEPART, "datetime-local");
        createEditTableRow(dateTbl, "Visa deadline: ", "visaEndInpEdit", activeEvent.END_VISA, "datetime-local");
        createEditTableRow(dateTbl, "Room deadline: ", "roomEndInpEdit", activeEvent.END_ROOM, "datetime-local");

        createElement("button", hiddenTab, "Save changes", 
        [
            {"name": "class", "value": "rightButton"},
            {"name": "onclick", "value": "saveEventChanges(" + eventId + ")"}
        ]);
        openHiddenTab();
    } 
    else if (response.ERROR != "No cookies") {
        showAlert("An error occurred :(", response.ERROR);
    }

    hideLoader();
}


async function saveEventChanges(eventId, hardCreate=false) {
    var response = null;
    if (eventId) {
        var request = prepareEventChangedData(hardCreate)
        response = await callEndpoint("POST", "/events/update", request);
    }
    else {
        var request = prepareEventChangedData(hardCreate)
        response = await callEndpoint("POST", "/events/create", request);
    }
    if (!response.ERROR) {
        if (eventId) {
            buildEventTable();
            showTimerAlert("Success :)", "Event was updated", alertTime, "divOkAlert",
                {"name": "okShowAlert", "duration": "0.5s"},
                {"name": "okHideAlert", "duration": "0.5s"}
            );
        }
        else {
            buildEventTable();
            showTimerAlert("Success :)", "Event was created", alertTime, "divOkAlert",
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
            showAlert("An error occurred :(", response.ERROR);
        }
    }
}

function prepareEventChangedData(hardCreate) {
    var newEvent = {
        "HARD_CREATE": hardCreate,
        "ID": activeEvent.ID,
        "NAME": getValueOf("nameInpEdit"),
        "CATEGORY": getValueOf("categInpEdit"),
        "PLACE": getValueOf("placeInpEdit"),
        "START": getValueOf("startInpEdit"),
        "END": getValueOf("endInpEdit"),
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
        "SHOW_HOTEL": getValueOf("showHotelInpEdit")
    }
    return newEvent;
}

function deleteEvent(eventId) {
    showConfirm("Really?", 
        "Do you really want to delete this event?<br>Action is irreversible.",
        function() {reallyDeleteEvent(eventId);});
}   

async function reallyDeleteEvent(eventId) {
    var response = await callEndpoint("POST", "/events/remove?id=" + eventId);
    if (!response.ERROR) {
        showTimerAlert("Success :)", "Event was deleted", alertTime, "divOkAlert",
                {"name": "okShowAlert", "duration": "0.5s"},
                {"name": "okHideAlert", "duration": "0.5s"}
            );
        buildEventTable();
    }
    else {
        showErrorAlert(response.ERROR, alertTime);
    }
}