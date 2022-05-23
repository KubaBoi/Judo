function buildDepTable() {
    let tbl = document.getElementById("depPeopleTable");
    clearTable(tbl);

    for (let i = 0; i < jbs.length; i++) {
        let jb = jbs[i];
        if (jb.ISIN && jb.DEP_FLIGHT == -1) {
            addRow(tbl, [
                {"text": jb.SUR_NAME + " " + jb.NAME,
                "attributes": [
                    {"name": "draggable", "value": true},
                    {"name": "id", "value": `personForDep${i}`}
                ]}
            ]);
        }
    }

    createDepartures();
}

var departs = [];

function addDeparture() {
    arrivals.push({
        "TIME": getTime(),
        "NUMBER": "",
        "NEED_TRANS": false
    });
    createDepartures();
}

function removeFromDep(index) {
    jbs[index].DEP_FLIGHT = -1;
    buildDepTable();
}

function createDepartures() {
    let dv = document.getElementById("depFlightsDiv");
    clearTable(dv);

    let welStr = "<div>Drag and drop people here</div>";

    for (let i = 0; i < arrivals.length; i++) {
        let arrival = arrivals[i];
        tbl = createElement("table", dv);
        addHeader(tbl, [
            {"text": `<input type="datetime-local" value="${arrival.TIME}">`},
            {"text": `<input type="text" value="${arrival.NUMBER}">`},
            {"text": `<input type="checkbox" checked="${arrival.NEED_TRANS}">`},
            {"text": `<img src="./images/deleteIcon48.png">`}
        ]);
        createElement("div", dv, welStr, [
            {"name": "class", "value": "depDivCls"},
            {"name": "id", "value": `depDiv${i}`}
        ]);
    }

    for (let i = 0; i < jbs.length; i++) {
        let jb = jbs[i];
        if (jb.DEP_FLIGHT == -1) continue;

        let flight = document.getElementById(`depDiv${jb.DEP_FLIGHT}`);
        if (flight.innerHTML == welStr) clearTable(flight);

        createElement("div", flight, `${jb.SUR_NAME} ${jb.NAME}
        <img src="./images/removeFromBedIcon.png" onclick="removeFromDep(${i})">`);
    }
}

function startDep(e) {
    if (!e.target.id.startsWith("personForDep")) return;

    dragged = e.target.id.replace("personForDep", "");
}

function dragDep(e) {
    if (!e.target.classList.contains("depDivCls")) return;
    e.target.classList.add("dragover");
}

function dropDep(e) {
    if (!e.target.classList.contains("depDivCls")) return;
    
    let flightId = e.target.id.replace("depDiv", "");

    jbs[dragged].DEP_FLIGHT = flightId;

    buildDepTable();
}