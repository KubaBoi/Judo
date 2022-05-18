var registrationsTable;

async function buildRegistrationsTable() {
    showLoader();
    registrationsTable = document.getElementById("registrationsTable");

    let needVisa = createElement("img", null, "", [
        {"name": "src", "value": "./images/needVisa.png"},
        {"name": "class", "value": "needVisa"},
        {"name": "title", "value": "Club needs visa"}
    ]).outerHTML;

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
                        "text": badgeTypes[tblI],
                        "attributes": [
                            {"name": "class", "value": "smallCellLast"},
                            {"name": "onclick", "value": `confirmRegisterButton(${regC.ID}, ${tblI})`}
                        ]
                    }
                ]);
            }
        }
    } 
    else if (response.ERROR != "No cookies") {
        showErrorAlert(response.ERROR, alertTime);
    }

    hideLoader();
    newContent("registrationsDiv");
}

function createRegistrationsHeaderRow() {
    var row = createElement("tr", registrationsTable);
    createElement("th", row, "Club");
    createElement("th", row, "Event");
    createElement("th", row, "Visa");
    createElement("th", row);
}