var registrationsTable;

async function buildRegistrationsTable() {
    registrationsTable = document.getElementById("registrationsTable");

    let tables = [
        "PENDING",
        "CHECKED",
        "REGISTERED"
    ]

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
                    {"text": regC.VISA},
                    {"text": tables[tblI]}
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
    createElement("th", row, "Status");
}