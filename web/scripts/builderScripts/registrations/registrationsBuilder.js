var registrationsTable;

async function buildRegistrationsTable() {
    registrationsTable = document.getElementById("registrationsTable");

    let tables = [
        createElement("img", null, "", [
            {"name": "src", "value": "./images/pendingIcon.png"},
            {"name": "class", "value": "pendingBadge"},
            {"name": "title", "value": "Waiting for administrator's confirmation"}
        ]).outerHTML,
        createElement("img", null, "", [
            {"name": "src", "value": "./images/pendingIcon.png"},
            {"name": "class", "value": "checkedBadge"},
            {"name": "title", "value": "Waiting for client's confirmation"}
        ]).outerHTML,
        createElement("img", null, "", [
            {"name": "src", "value": "./images/okIcon.png"},
            {"name": "class", "value": "registeredBadge"},
            {"name": "title", "value": "Registered"}
        ]).outerHTML
    ];

    let needVisa = createElement("img", null, "", [
        {"name": "src", "value": "./images/needVisa.png"},
        {"name": "class", "value": "needVisa"},
        {"name": "title", "value": "Club needs visa"}
    ]).outerHTML;

    newContent("registrationsDiv");

    var response = await callEndpoint("GET", "/registeredClubs/getAllData");
    if (!response.ERROR) {
        clearTable(registrationsTable);

        createRegistrationsHeaderRow();

        for (let tblI = 0; tblI < 3; tblI++) {

            for (var i = 0; i < response.REGISTERED_CLUBS.length; i++) {
                let regC = response.REGISTERED_CLUBS[i];

                if (regC.STATUS != tblI) continue;

                addRow(registrationsTable, [
                    {"text": regC.CLUB_NAME},
                    {"text": regC.EVENT_NAME},
                    {
                        "text": (regC.VISA) ? needVisa : "", 
                        "attributes": [{"name": "class", "value": "smallCellLast"}]
                    },
                    {
                        "text": tables[tblI],
                        "attributes": [{"name": "class", "value": "smallCellLast"}]
                    }
                ]);
            }
        }
    } 
    else if (response.ERROR != "No cookies") {
        showAlert("An error occurred :(", response.ERROR);
    }
}

function createRegistrationsHeaderRow() {
    var row = createElement("tr", registrationsTable);
    createElement("th", row, "Club");
    createElement("th", row, "Event");
    createElement("th", row, "Visa");
    createElement("th", row);
}