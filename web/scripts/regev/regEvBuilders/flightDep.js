function buildDepTable() {
    let tbl = document.getElementById("depPeopleTable");
    clearTable(tbl);

    changeNotification(4, "notifDone", "Done");

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

            changeNotification(4, "notifPend", "Someone does not have been assigned to any flight");
        }
    }

    createDepartures();
}

var departs = [];

function addDeparture() {
    departs.push({
        "TIME": null,
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

    for (let i = 0; i < departs.length; i++) {
        let depart = departs[i];
        tbl = createElement("table", dv);
        addHeader(tbl, [
            {"text": `<label>Departure time: </label><input type="datetime-local" value="${getTimestamp(depart.TIME, false)}">`},
            {"text": `<label>Flight number: </label><input type="text" value="${depart.NUMBER}">`},
            {"text": `<label>Need transport: </label><input type="checkbox" checked="${depart.NEED_TRANS}">`},
            {"text": `<img src="./images/deleteIcon48.png">`}
        ]);

        let buttDiv = createElement("div", dv);
        createElement("button", buttDiv, "Add all", [
            {"name": "onclick", "value": `addAllToDep(${i})`}
        ]);
        createElement("button", buttDiv, "Remove all", [
            {"name": "onclick", "value": `removeAllFromDep(${i})`}
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

        if (!jb.ISIN) {
            dv.classList.add("missing");
            changeNotification(4, "notifErr", "Someone is assigned into flight but is not included in event");
        }
    }
}

function startDep(e) {
    if (!e.target.id.startsWith("personForDep")) return;

    dragged = e.target.id.replace("personForDep", "");
}

function dragDep(e) {
    if (e.target.classList.contains("depDivCls"))
        e.target.classList.add("dragover");
    else if (e.target.parentNode != null) {
        if (e.target.parentNode.classList.contains("depDivCls")) {
            e.target.parentNode.classList.add("dragover");
        }
    }
}

function dropDep(e) {
    if (!e.target.classList.contains("depDivCls")) {
        if (e.target.parentNode != null) {
            if (!e.target.parentNode.classList.contains("depDivCls")) {
                return;
            }
        }
        else {
            return;
        }
    }

    let target = e.target;

    if (e.target.parentNode.classList.contains("depDivCls")) {
        target = e.target.parentNode;
        target.classList.remove("dragover");
        target.classList.remove("dragoverfull");
    }
    
    let flightId = target.id.replace("arrDiv", "");

    jbs[dragged].DEP_FLIGHT = flightId;

    buildDepTable();
}

function addAllToDep(index) {
    for (let i = 0; i < jbs.length; i++) {
        if (jbs[i].DEP_FLIGHT != -1) continue;
        jbs[i].DEP_FLIGHT = index;
    }
    buildDepTable();
}

function removeAllFromDep(index) {
    for (let i = 0; i < jbs.length; i++) {
        if (jbs[i].DEP_FLIGHT == index) {
            jbs[i].DEP_FLIGHT = -1;
        }
    }
    buildDepTable();
}