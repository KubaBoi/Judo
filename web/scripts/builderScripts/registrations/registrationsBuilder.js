var registrationsTable;

async function buildRegistrationsTable() {
    showLoader();
    registrationsTable = document.getElementById("registrationsTable");

    var response = await callEndpoint("GET", "/events/getByOrganiserAllData");
    if (!response.ERROR) {
        clearTable(registrationsTable);
        
        let events = response.EVENTS;

        for (let i = 0; i < events.length; i++) {
            let event = events[i];
            addHeader(registrationsTable, [
                {"text": event.NAME, "attributes": [{"name": "colspan", "value": 3}]}
            ]);
            addRow(registrationsTable, [{"text": createEditRow(event, i), "attributes": [{"name": "colspan", "value": 3}]}]);

            let regClubs = event.REG_CLUBS;
            if (regClubs.length == 0) {
                addRow(registrationsTable, [
                    {"text": "There are not any clubs registered in this event yet.", "attributes": [
                        {"name": "colspan", "value": 3}
                    ]}
                ]);
            }
            else {
                // HIDE BUTTON
                let closeButt = createElement("button", null, "^", [
                    {"name": "onclick", "value": `closeEventRows(this, ${i})`},
                    {"name": "class", "value": "hideButton"},
                    {"name": "title", "value": "Hide registered clubs"}
                ]);
                addHeader(registrationsTable, [
                    {"text": closeButt.outerHTML, "attributes": [{"name": "colspan", "value": 3}]}
                ]);

                // CLUBS HEADER
                addHeader(registrationsTable, [
                    {"text": "Registered clubs", "attributes": [
                        {"name": "style", "value": "text-align:left;"}
                    ]},
                    {"text": "Address"},
                    {"text": "Status"}
                ], [
                    {"name": "class", "value": `eventClubsRow${i} eventOpenedRows`}
                ]);

                // CLUBS
                for (let o = 0; o < regClubs.length; o++) {
                    let regClub = regClubs[o];
                    addRow(registrationsTable, [
                        {"text": regClub.CLUB.NAME},
                        {"text": getImage(regClub.CLUB.STATE) + " " + regClub.CLUB.ADDRESS},
                        {"text": badgeTypes[regClub.STATUS], "attributes": [
                            {"name": "class", "value": "smallCellLast"},
                            {"name": "onclick", "value": (regClub.STATUS == 2) ? `showRegistration(${regClub.ID})` : ""}
                        ]}
                    ], [
                        {"name": "class", "value": `eventClubsRow${i} eventOpenedRows`}
                    ]);
                }

                // SPLITER
                addHeader(registrationsTable, [
                    {"text": "<hr>", "attributes": [{"name": "colspan", "value": 3}]}
                ]);
            }
        }
    } 
    else {
        showErrorAlert(response.ERROR, alertTime);
    }

    hideLoader();
    newContent("registrationsDiv");
}

function createEditRow(event) {
    let editButt = createElement("img", null, "",
    [
        {"name": "src", "value": "/images/editIcon48.png"},
        {"name": "onclick", "value": "editEventTab(" + event.ID + ")"},
        {"name": "title", "value": "Edit event"}
    ]);

    let deleteButt = createElement("img", null, "",
    [
        {"name": "src", "value": "/images/deleteIcon48.png"},
        {"name": "onclick", "value": "deleteEvent(" + event.ID + ")"},
        {"name": "title", "value": "Delete event"}
    ]);
    
    let pdfButton = createElement("img", null, "", [
        {"name": "src", "value": "./images/generatePdf.png"},
        {"name": "onclick", "value": `generateEventPdf(${event.ID})`},
        {"name": "class", "value": "registeredBadge"},
        {"name": "title", "value": "Generate event PDF"}
    ]);

    let pdfShortButton = createElement("img", null, "", [
        {"name": "src", "value": "./images/pdfShortIcon.png"},
        {"name": "onclick", "value": `generateEventShortPdf(${event.ID})`},
        {"name": "class", "value": "registeredBadge"},
        {"name": "title", "value": "Generate event PDF"}
    ]);

    let regButt = createElement("img", null, "",
    [
        {"name": "src", "value": "./images/jbIcon.png"},
        {"name": "onclick", "value": `editRegistrationTab(${event.ID})`},
        {"name": "class", "value": "pendingBadge"},
        {"name": "title", "value": "Upload JBs and confirm club's registrations"}
    ]);

    return ( 
        editButt.outerHTML + 
        deleteButt.outerHTML + 
        pdfButton.outerHTML + 
        pdfShortButton.outerHTML +
        regButt.outerHTML
    );
}

function closeEventRows(button, index) {   
    let rows = document.getElementsByClassName(`eventClubsRow${index}`);

    let remClass = "eventOpenedRows";
    let addClass = "eventClosedRows";
    let buttText = "v";
    let buttTitle = "Show registered clubs";
    
    if (button.innerHTML == "v") {
        buttText = "^";
        remClass = "eventClosedRows";
        addClass = "eventOpenedRows";
        buttTitle = "Hide registered clubs"
    }

    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        row.classList.remove(remClass);
        row.classList.add(addClass);
    }

    button.innerHTML = buttText;
    button.setAttribute("title", buttTitle);
}