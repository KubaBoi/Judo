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
    departs.push({
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

    for (let i = 0; i < departs.length; i++) {
        let depart = departs[i];
        tbl = createElement("table", dv);
        addHeader(tbl, [
            {"text": `<input type="datetime-local" value="${depart.TIME}">`},
            {"text": `<input type="text" value="${depart.NUMBER}">`},
            {"text": `<input type="checkbox" checked="${depart.NEED_TRANS}">`},
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