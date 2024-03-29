function buildDepTable() {
    let tbl = document.getElementById("depPeopleTable");
    clearTable(tbl);

    changeNotification("notifDeparture", "notifDone", "Done", false);

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
        "TIME": getTimestamp(activeEvent.DEPART, false),
        "NUMBER": "",
        "NEED_TRANS": false
    });
    createDepartures();
    checkIfDoneDep();
}

function removeDepart(index) {
    for (let i = 0; i < jbs.length; i++) {
        let jb = jbs[i];
        if (jb.DEP_FLIGHT == index) {
            jb.DEP_FLIGHT = -1;
        }
        else if (jb.DEP_FLIGHT > index) {
            jb.DEP_FLIGHT -= 1;
        }
    }

    removeFromArrayByIndex(departs, index)
    buildDepTable();
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

        let dis = "";

        // BY CAR SELECT
        let checkDivByCar =  createElement("label", null, "", [{"name": "class", "value": "checkBoxDiv"}]);
        let attrsByCar = [
            {"name": "type", "value": "checkbox"},
            {"name": "id", "value": `depByCarInp${i}`}
        ];
        if (depart.NUMBER == "BY CAR") {
            attrsByCar.push({"name": "checked", "value": ""});
            dis = "disabled";
        }
        createElement("input", checkDivByCar, "", attrsByCar);
        createElement("span", checkDivByCar, "", [{"name": "class", "value": "checkmark"}]);


        // NEED TRANSPORT SELECT
        let checkDiv =  createElement("label", null, "", [{"name": "class", "value": "checkBoxDiv"}]);
        let attrs = [
            {"name": "type", "value": "checkbox"},
            {"name": "id", "value": `depTranInp${i}`}
        ];
        if (depart.NEED_TRANS) attrs.push({"name": "checked", "value": depart.NEED_TRANS});
        if (dis == "disabled") attrs.push({"name": "disabled", "value": ""});
        
        createElement("input", checkDiv, "", attrs);
        createElement("span", checkDiv, "", [{"name": "class", "value": "checkmark"}]);

        addHeader(tbl, [
            {"text": `<label>Departure time:</label><br><input type="datetime-local" id="depTmInp${i}" value="${depart.TIME}">`},
            {"text": `<label>By Car:</label><br>${checkDivByCar.outerHTML}`},
            {"text": `<label>Flight number:</label><br><input type="text" id="depNumInp${i}" value="${depart.NUMBER}" ${dis}>`},
            {"text": `<label>Need transport:</label><br>${checkDiv.outerHTML}`},
            {"text": `<img src="./images/deleteIcon48.png" onclick=removeDepart(${i}) title="Remove flight">`}
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
        let depByCarInp = document.getElementById(`depByCarInp${i}`);
        let depNumInp = document.getElementById(`depNumInp${i}`);
        let depTranInp = document.getElementById(`depTranInp${i}`);

        depTmInp.addEventListener("change", function(){depChange(i)});
        depByCarInp.addEventListener("change", function(){depChange(i)});
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
            changeNotification("notifDeparture", "notifErr", "Someone is assigned into flight but is not included in event");
        }
    }
}

function depChange(index) {
    let depart = departs[index];
    depart.TIME = document.getElementById(`depTmInp${index}`).value;
    depart.NUMBER = document.getElementById(`depNumInp${index}`).value;
    depart.NEED_TRANS = document.getElementById(`depTranInp${index}`).checked;
    
    if (document.getElementById(`depByCarInp${index}`).checked) {
        depart.NUMBER = "BY CAR";
        depart.NEED_TRANS = false; 
    }
    else if (depart.NUMBER == "BY CAR") {
        depart.NUMBER = "";
    }

    createDepartures();
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
        if (jbs[i].DEP_FLIGHT != -1 || !jbs[i].ISIN) continue;
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
            changeNotification("notifDeparture", "notifPend", "Some flight is missing time or number.");
            return;
        }
    }

    for (let i = 0; i < jbs.length; i++) {
        let jb = jbs[i];
        if (!jb.ISIN) continue;
        if (jb.DEP_FLIGHT == -1) {
            changeNotification("notifDeparture", "notifPend", "Someone does not have been assigned to any flight");
            return;
        }
    }

    // check if there is not an error
    if (getNotifStatus("notifDeparture") != 2) {
        changeNotification("notifDeparture", "notifDone", "Done");
    }
}