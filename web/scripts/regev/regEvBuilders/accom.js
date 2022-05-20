
function buildAccTable() {
    let tbl = document.getElementById("accPeopleTable");
    clearTable(tbl);

    for (let i = 0; i < jbs.length; i++) {
        let jb = jbs[i];
        if (jb.ISIN && jb.ROOM_ID == -1) {
            addRow(tbl, [
                {"text": jb.SUR_NAME + " " + jb.NAME,
                "attributes": [
                    {"name": "draggable", "value": true},
                    {"name": "id", "value": `personForBed${i}`}
                ]}
            ]);
        }
    }
}

function buildRoomDiv() {
    let roomDiv = document.getElementById("accRoomDiv");
    clearTable(roomDiv);
    
    let width = "160px ";
    let rowCount = 5;
    let rowSize = Math.floor(100/rowCount);

    let cols = "";
    let rows = "";
    for (let i = 0; i < Math.ceil(rooms.length/rowCount); i++) {
        cols += width;
    }
    for (let i = 0; i < rowCount; i++) {
        rows += `${rowSize}%`;
    }


    roomDiv.style.gridTemplateColumns = cols;
    roomDiv.style.gridTemplateRows = rows;

    for (let i = 0; i < rooms.length; i++) {
        let room = rooms[i];
        let img = "<img src='./images/bedIcon.png'>"
        let bedString = "";
        for (let o = 0; o < room.BED; o++) bedString += img;

        var oneRoomDiv = createElement("div", roomDiv, bedString, [
            {"name": "class", "value": "accRoomRoomDiv"},
            {"name": "id", "value": `room${room.ID}-${room.BED}`}
        ]);

        createElement("hr", oneRoomDiv);
        createElement("table", oneRoomDiv, "", [
            {"name": "id", "value": `roomTable${room.ID}`}
        ]);
    }

    for (let i = 0; i < jbs.length; i++) {
        let jb = jbs[i];
        if (jb.ROOM_ID == -1) continue;

        var oneRoomTable = document.getElementById(`roomTable${jb.ROOM_ID}`);

        let rw = addRow(oneRoomTable, [
            {"text": `${jb.SUR_NAME} ${jb.NAME.substring(0, 1)}. 
            <img src='./images/removeFromBedIcon.png' class='removeFromBed' title='Remove person from room'
            onclick='removeFromBed(${i})'>`}
        ]);

        if (!jb.ISIN) {
            rw.classList.add("missing");
        }
    }
}

function removeFromBed(id) {
    jbs[id].ROOM_ID = -1;
    rebuildRegEvTables();
}