function buildDepTable() {
    let tbl = document.getElementById("depPeopleTable");
    clearTable(tbl);

    changeNotification(4, "notifDone", "Done", false);

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
    checkIfDoneDep();
}

var departs = [];

function addDeparture() {
    departs.push({
        "TIME": null,
        "NUMBER": "",
        "NEED_TRANS": false
    });
    createDepartures();
    checkIfDoneDep();
}

function removeDepart(index) {
    
}

function removeFromDep(index) {
    jbs[index].DEP_FLIGHT = -1;
    buildDepTable();
}

function createDepartures() {
    let dv = document.getElementById("depFlightsDiv");
    clearTable(dv);

    let welStr = "Drag and drop people here";

    for (let i = 0; i < departs.length; i++) {
        let depart = departs[i];
        tbl = createElement("table", dv);
        addHeader(tbl, [
            {"text": `<label>Departure time: </label><input type="datetime-local" id="depTmInp${i}" value="${getTimestamp(depart.TIME, false)}">`},
            {"text": `<label>Flight number: </label><input type="text" id="depNumInp${i}" value="${depart.NUMBER}">`},
            {"text": `<label>Need transport: </label><input type="checkbox" id="depTranInp${i}" checked="${depart.NEED_TRANS}">`},
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

        let depTmInp = document.getElementById(`depTmInp${i}`);
        let depNumInp = document.getElementById(`depNumInp${i}`);
        let depTranInp = document.getElementById(`depTranInp${i}`);

        depTmInp.addEventListener("change", function(){depChange(i)});
        depNumInp.addEventListener("change", function(){depChange(i)});
        depTranInp.addEventListener("change", function(){depChange(i)});
    
    }

    for (let i = 0; i < jbs.length; i++) {
        let jb = jbs[i];
        if (jb.DEP_FLIGHT == -1) continue;

        let flight = document.getElementById(`depDiv${jb.DEP_FLIGHT}`);
        if (flight.innerHTML == welStr) clearTable(flight);

        let dv = createElement("div", flight, `${jb.SUR_NAME} ${jb.NAME}
        <img src="./images/removeFromBedIcon.png" onclick="removeFromDep(${i})">`);

        if (!jb.ISIN) {
            dv.classList.add("missing");
            changeNotification(4, "notifErr", "Someone is assigned into flight but is not included in event");
        }
    }
}

function depChange(index) {
    let depart = departs[index];
    depart.TIME = document.getElementById(`depTmInp${index}`).value;
    depart.NUMBER = document.getElementById(`depNumInp${index}`).value;
    depart.NEED_TRANS = document.getElementById(`depTranInp${index}`).checked;

    checkIfDoneDep();
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
    
    let flightId = target.id.replace("depDiv", "");

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

function checkIfDoneDep() {    
    for (let i = 0; i < departs.length; i++) {
        let tm = document.getElementById(`depTmInp${i}`);
        let num = document.getElementById(`depNumInp${i}`);

        if (tm.value == "" ||
            num.value == "") {
            changeNotification(4, "notifPend", "Some flight is missing time or number.");
            return;
        }
    }

    for (let i = 0; i < jbs.length; i++) {
        let jb = jbs[i];
        if (!jb.ISIN) continue;
        if (jb.DEP_FLIGHT == -1) {
            changeNotification(4, "notifPend", "Someone does not have been assigned to any flight");
            return;
        }
    }

    // check if there is not an error
    if (getNotifStatus(4) != 2) {
        changeNotification(4, "notifDone", "Done");
    }
}