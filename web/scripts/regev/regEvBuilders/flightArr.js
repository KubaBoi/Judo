function buildArrTable() {
    let tbl = document.getElementById("arrPeopleTable");
    clearTable(tbl);

    changeNotification("notifArrival", "notifDone", "Done", false);

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
    checkIfDoneArr();
}

var arrivals = [];

function addArrival() {
    arrivals.push({
        "TIME": activeEvent.ARRIVE,
        "NUMBER": "",
        "NEED_TRANS": false
    });
    createArrivals();
    checkIfDoneArr();
}

function removeArrival(index) {
    for (let i = 0; i < jbs.length; i++) {
        let jb = jbs[i];
        if (jb.ARR_FLIGHT == index) {
            jb.ARR_FLIGHT = -1;
        }
        else if (jb.ARR_FLIGHT > index) {
            jb.ARR_FLIGHT -= 1;
        }
    }

    removeFromArrayByIndex(arrivals, index)
    buildArrTable();
}

function removeFromArr(index) {
    jbs[index].ARR_FLIGHT = -1;
    buildArrTable();
}

function createArrivals() {
    let dv = document.getElementById("arrFlightsDiv");
    clearTable(dv);

    let welStr = `Drag and drop people here`;

    for (let i = 0; i < arrivals.length; i++) {
        let arrival = arrivals[i];
        tbl = createElement("table", dv);

        let checkDiv =  createElement("label", null, "", [{"name": "class", "value": "checkBoxDiv"}]);
        createElement("input", checkDiv, "", [
            {"name": "type", "value": "checkbox"},
            {"name": "id", "value": `arrTranInp${i}`},
            {"name": "checked", "value": arrival.NEED_TRANS}
        ]);
        createElement("span", checkDiv, "", [{"name": "class", "value": "checkmark"}]);

        addHeader(tbl, [
            {"text": `<label>Arrival time: </label><br><input type="datetime-local" id="arrTmInp${i}" value="${getTimestamp(arrival.TIME, false)}">`},
            {"text": `<label>Flight number: </label><br><input type="text" id="arrNumInp${i}" value="${arrival.NUMBER}">`},
            {"text": `<label>Need transport: </label><br>${checkDiv.outerHTML}`},
            {"text": `<img src="./images/deleteIcon48.png" onclick=removeArrival(${i}) title="Remove flight">`}
        ]);

        let buttDiv = createElement("div", dv);
        createElement("button", buttDiv, "Add all", [
            {"name": "onclick", "value": `addAllToArr(${i})`}
        ]);
        createElement("button", buttDiv, "Remove all", [
            {"name": "onclick", "value": `removeAllFromArr(${i})`}
        ]);

        createElement("div", dv, welStr, [
            {"name": "class", "value": "arrDivCls"},
            {"name": "id", "value": `arrDiv${i}`}
        ]);

        let arrTmInp = document.getElementById(`arrTmInp${i}`);
        let arrNumInp = document.getElementById(`arrNumInp${i}`);
        let arrTranInp = document.getElementById(`arrTranInp${i}`);

        arrTmInp.addEventListener("change", function(){arrChange(i)});
        arrNumInp.addEventListener("change", function(){arrChange(i)});
        arrTranInp.addEventListener("change", function(){arrChange(i)});
    }

    for (let i = 0; i < jbs.length; i++) {
        let jb = jbs[i];
        if (jb.ARR_FLIGHT == -1) continue;

        let flight = document.getElementById(`arrDiv${jb.ARR_FLIGHT}`);
        if (flight.innerHTML == welStr) clearTable(flight);

        let dv = createElement("div", flight, `${jb.SUR_NAME} ${jb.NAME}
        <img src="./images/removeFromBedIcon.png" onclick="removeFromArr(${i})">`);

        if (!jb.ISIN) {
            dv.classList.add("missing");
            changeNotification("notifArrival", "notifErr", "Someone is assigned into flight but is not included in event");
        }
    }
}

function arrChange(index) {
    let arrival = arrivals[index];
    arrival.TIME = document.getElementById(`arrTmInp${index}`).value;
    arrival.NUMBER = document.getElementById(`arrNumInp${index}`).value;
    arrival.NEED_TRANS = document.getElementById(`arrTranInp${index}`).checked;

    checkIfDoneArr();
}

function startArr(e) {
    if (!e.target.id.startsWith("personForArr")) return;

    dragged = e.target.id.replace("personForArr", "");
}

function dragArr(e) {
    if (e.target.classList.contains("arrDivCls"))
        e.target.classList.add("dragover");
    else if (e.target.parentNode != null) {
        if (e.target.parentNode.classList.contains("arrDivCls")) {
            e.target.parentNode.classList.add("dragover");
        }
    }
}

function dropArr(e) {
    if (!e.target.classList.contains("arrDivCls")) {
        if (e.target.parentNode != null) {
            if (!e.target.parentNode.classList.contains("arrDivCls")) {
                return;
            }
        }
        else {
            return;
        }
    }

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

function addAllToArr(index) {
    for (let i = 0; i < jbs.length; i++) {
        if (jbs[i].ARR_FLIGHT != -1 || !jbs[i].ISIN) continue;
        jbs[i].ARR_FLIGHT = index;
    }
    buildArrTable();
}

function removeAllFromArr(index) {
    for (let i = 0; i < jbs.length; i++) {
        if (jbs[i].ARR_FLIGHT == index) {
            jbs[i].ARR_FLIGHT = -1;
        }
    }
    buildArrTable();
}

function checkIfDoneArr() {    
    for (let i = 0; i < arrivals.length; i++) {
        let tm = document.getElementById(`arrTmInp${i}`);
        let num = document.getElementById(`arrNumInp${i}`);

        if (tm.value == "" ||
            num.value == "") {
            changeNotification("notifArrival", "notifPend", "Some flight is missing time or number.");
            return;
        }
    }

    for (let i = 0; i < jbs.length; i++) {
        let jb = jbs[i];
        if (!jb.ISIN) continue;
        if (jb.ARR_FLIGHT == -1) {
            changeNotification("notifArrival", "notifPend", "Someone does not have been assigned to any flight");
            return;
        }
    }

    // check if there is not an error
    if (getNotifStatus("notifArrival") != 2) {
        changeNotification("notifArrival", "notifDone", "Done");
    }
}