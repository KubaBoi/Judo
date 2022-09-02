var eventTable;

async function buildEventTable(newCont=true) {
    showLoader();
    eventTable = document.getElementById("eventTable");

    var response = await callEndpoint("GET", `/events/getBy${createEventFilters()}`);
    if (response.ERROR == null) {
        eventTable.innerHTML = "";
        createEventHeaderRow();
        for (var i = 0; i < response.EVENTS.length; i++) {
            buildEventRow(response.EVENTS[i]);
        }
    } 
    else {
        showErrorAlert(response.ERROR, alertTime);
    }

    hideLoader();
    if (newCont) {
        newContent("eventsDiv");
    }
}

function createEventFilters() {
    var filter = `?clubId=${loggedClub.ID}`;

    var values = ["nameEventSort", "categoryEventSort", "placeEventSort", "startEventSort"]

    for (let i = 0; i < values.length; i++) {
        var elem = document.getElementById(values[i]); 
        if (elem.checked) filter += "&column=" + elem.value;
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
                {"name": "onclick", "value": `registerButton(${event.ID}, ${event.STATUS})`}
            ]
        }
    ]);
}

function createEventHeaderRow() {
    var row = createElement("tr", eventTable);
    createElement("th", row, "Name");
    createElement("th", row, "Start");
    createElement("th", row, "Place");
    createElement("th", row);
}

async function generateEventPdf(eventId) {
    showLoader();
    let response = await callEndpoint("GET", `/bills/generateEventPdf?eventId=${eventId}`);
    if (response.ERROR == null) {
        pdf = response.PDF;
        window.open(`/bills/pdf/${pdf}`, "_blank");
    }
    else {
        showErrorAlert(response.ERROR, alertTime);
    }
    hideLoader();
} 