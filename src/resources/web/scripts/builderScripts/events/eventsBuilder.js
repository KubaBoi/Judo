var eventTable;

async function buildEventTable() {
    eventTable = document.getElementById("eventTable");

    var response = await callEndpoint("GET", "/events/getBy" + createEventFilters());
    if (!response.ERROR) {
        eventTable.innerHTML = "";
        createEventHeaderRow();
        for (var i = 0; i < response.EVENTS.length; i++) {
            buildEventRow(response.EVENTS[i]);
        }

        setTimeout(function() { newContent("eventsDiv"); }, activeContent);
    } 
    else if (response.ERROR != "No cookies") {
        showAlert("An error occurred :(", response.ERROR);
    }
}

function createEventFilters() {
    var filter = "";

    var values = ["nameEventSort", "categoryEventSort", "placeEventSort", "startEventSort"]

    for (let i = 0; i < values.length; i++) {
        var elem = document.getElementById(values[i]); 
        if (elem.checked) filter = "?column=" + elem.value;
    }

    return filter;
}

function buildEventRow(event) {
    var row = createElement("tr", eventTable);
    createElement("td", row, event.NAME, 
    [
        {"name": "onclick", "value": "showEventTab(" + event.ID + ")"}
    ]);

    createElement("td", row, event.START, 
    [
        {"name": "onclick", "value": "showEventTab(" + event.ID + ")"}
    ]);

    createElement("td", row, event.PLACE, 
    [
        {"name": "onclick", "value": "showEventTab(" + event.ID + ")"}
    ]);
    
    if (loggedUser.RULE_ID < 2) {
        createElement("td", row, "<img src='/images/editIcon48.png'>",
        [
            {"name": "class", "value": "smallCell"},
            {"name": "onclick", "value": "editEventTab(" + event.ID + ")"}
        ]);

        createElement("td", row, "<img src='/images/deleteIcon48.png'>",
        [
            {"name": "class", "value": "smallCellLast"},
            {"name": "onclick", "value": "deleteEvent(" + event.ID + ")"}
        ]);
    }
}

function createEventHeaderRow() {
    var row = createElement("tr", eventTable);
    createElement("th", row, "Name");
    createElement("th", row, "Start");
    createElement("th", row, "Place");
    if (loggedUser.RULE_ID < 2) {
        createElement("th", row);
        createElement("th", row);
    }
}