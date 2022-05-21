function buildFlightTable() {
    let tbl = document.getElementById("arrPeopleTable");
    clearTable(tbl);

    for (let i = 0; i < jbs.length; i++) {
        let jb = jbs[i];
        if (jb.ISIN && jb.ROOM_ID == -1) {
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
var departs = [];

function addArrival() {
    arrivals.push({
        "TIME": getTime(),
        "NUMBER": "",
        "NEED_TRANS": false
    });
    createArrivals();
    console.log("oujeee")
}

function createArrivals() {
    let tbl = document.getElementById("arrFlightsTable");
    clearTable(tbl);

    addHeader(tbl, [
        {"text": "Arrival"},
        {"text": "Flight number"},
        {"text": "Need transport"},
        {"text": ""}
    ])

    for (let i = 0; i < arrivals.length; i++) {
        let arrival = arrivals[i];
        addHeader(tbl, [
            {"text": `<input type="datetime-local" value="${arrival.TIME}">`},
            {"text": `<input type="text" value="${arrival.NUMBER}">`},
            {"text": `<input type="checkbox" checked="${arrival.NEED_TRANS}">`},
            {"text": `<img src="./images/deleteIcon48.png">`}
        ]);
    }
}