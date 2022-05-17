var eventTable;

async function buildEventTable() {
    eventTable = document.getElementById("eventTable");

    newContent("eventsDiv");

    var response = await callEndpoint("GET", "/events/getBy" + createEventFilters());
    if (!response.ERROR) {
        eventTable.innerHTML = "";
        createEventHeaderRow();
        for (var i = 0; i < response.EVENTS.length; i++) {
            buildEventRow(response.EVENTS[i]);
        }
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
    let row = addRow(eventTable, [
        {
            "text": event.NAME, "attributes": [
                {"name": "onclick", "value": "showEventTab(" + event.ID + ")"}
            ]
        },
        {
            "text": event.START, "attributes": [
                {"name": "onclick", "value": "showEventTab(" + event.ID + ")"}
            ]
        },
        {
            "text": event.PLACE, "attributes": [
                {"name": "onclick", "value": "showEventTab(" + event.ID + ")"}
            ]
        },
        {
            "text": badgeTypes[event.STATUS], "attributes": [
                {"name": "class", "value": "smallCellLast"},
                {"name": "onclick", "value": "registerToEventShow(" + event.ID + ")"}
            ]
        }
    ]);
    
    if (loggedUser.ROLE_ID < 2) {
        createElement("td", row, "<img src='/images/editIcon48.png'>",
        [
            {"name": "class", "value": "smallCell"},
            {"name": "onclick", "value": "editEventTab(" + event.ID + ")"},
            {"name": "title", "value": "Edit event"}
        ]);

        createElement("td", row, "<img src='/images/deleteIcon48.png'>",
        [
            {"name": "class", "value": "smallCellLast"},
            {"name": "onclick", "value": "deleteEvent(" + event.ID + ")"},
            {"name": "title", "value": "Delete event"}
        ]);
    }
}

function createEventHeaderRow() {
    var row = createElement("tr", eventTable);
    createElement("th", row, "Name");
    createElement("th", row, "Start");
    createElement("th", row, "Place");
    createElement("th", row);
    if (loggedUser.ROLE_ID < 2) {
        createElement("th", row);
        createElement("th", row);
    }
}