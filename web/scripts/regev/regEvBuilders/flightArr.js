function buildArrTable() {
    let tbl = document.getElementById("arrPeopleTable");
    clearTable(tbl);

    for (let i = 0; i < jbs.length; i++) {
        let jb = jbs[i];
        if (jb.ISIN && jb.ARR_FLIGHT == -1) {
            addRow(tbl, [
                {"text": jb.SUR_NAME + " " + jb.NAME,
                "attributes": [
                    {"name": "draggable", "value": true},
                    {"name": "id", "value": `personForArr${i}`}
                ]}
            ]);
        }
    }

    createArrivals();
}

var arrivals = [];

function addArrival() {
    arrivals.push({
        "TIME": getTime(),
        "NUMBER": "",
        "NEED_TRANS": false
    });
    createArrivals();
}

function removeFromArr(index) {
    jbs[index].ARR_FLIGHT = -1;
    buildArrTable();
}

function createArrivals() {
    let dv = document.getElementById("arrFlightsDiv");
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
            {"name": "class", "value": "arrDivCls"},
            {"name": "id", "value": `arrDiv${i}`}
        ]);
    }

    for (let i = 0; i < jbs.length; i++) {
        let jb = jbs[i];
        if (jb.ARR_FLIGHT == -1) continue;

        let flight = document.getElementById(`arrDiv${jb.ARR_FLIGHT}`);
        if (flight.innerHTML == welStr) clearTable(flight);

        createElement("div", flight, `${jb.SUR_NAME} ${jb.NAME}
        <img src="./images/removeFromBedIcon.png" onclick="removeFromArr(${i})">`);
    }
}

function startArr(e) {
    if (!e.target.id.startsWith("personForArr")) return;

    dragged = e.target.id.replace("personForArr", "");
}

function dragArr(e) {
    if (e.target.classList.contains("arrDivCls"))
        e.target.classList.add("dragover");
    else if (e.target.parentNode.classList.contains("arrDivCls"))
        e.target.parentNode.classList.add("dragover");
}

function dropArr(e) {
    if (e.target.classList.contains("arrDivCls") &&
        e.target.parentNode.classList.contains("arrDivCls"))
        return;

    let target = e.target;

    if (e.target.parentNode.classList.contains("arrDivCls")) {
        target = e.target.parentNode;
        target.classList.remove("dragover");
        target.classList.remove("dragoverfull");
    }
    
    let flightId = target.id.replace("arrDiv", "");

    jbs[dragged].ARR_FLIGHT = flightId;

    buildArrTable();
}