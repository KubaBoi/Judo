
function buildAccTable() {
    let tbl = document.getElementById("accPeopleTable");
    clearTable(tbl);

    let isDone = true;

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
            isDone = false;
        }
    }

    if (isDone) changeNotification(1, "notifDone", "Done");
    else changeNotification(1, "notifPend", "Someone has not assigned room");

    buildVisaTable();
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

        var oneRoomDiv = createElement("div", roomDiv, bedString + `${room.HOTEL_ID}`, [
            {"name": "class", "value": "accRoomRoomDiv"},
            {"name": "id", "value": `room${room.ID}`}
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
            onclick='removeFromBed(${i})'>`, "attributes": [
                {"name": "draggable", "value": true},
                {"name": "id", "value": `personForBed${i}`}
            ]}
        ]);

        if (!jb.ISIN) {
            rw.classList.add("missing");
            changeNotification(1, "notifErr", "Someone has assigned room but is not included in event");
        }
    }
}

function isRoomFull(room) {
    let roomId = room.id.replace("room", "");
    let roomMaxBed = room.querySelectorAll("img").length;
    roomMaxBed -= room.querySelectorAll("img.removefrombed").length;

    let roomTable = document.getElementById(`roomTable${roomId}`);
    let rows = roomTable.querySelectorAll("td").length;

    return (rows >= roomMaxBed);
}

function removeFromBed(id) {
    jbs[id].ROOM_ID = -1;
    buildAccTable();
    buildRoomDiv();
}

function autoClass() {
    resetBeds();
    let roomId = autoClassGender();
    roomId = autoClassGender(roomId, "w");
    buildAccTable();
    buildRoomDiv();
}

function autoClassGender(roomIndex=0, gender="m") {
    if (roomIndex == -1) return;
    for (let i = 0; i < jbs.length; i++) {
        if (jbs[i].GENDER != gender) continue;
        if (!jbs[i].ISIN) continue;

        if (roomIndex >= rooms.length) {
            showAlert("Not enought space", `There is not enought rooms for your team.
            <br>Contact organiser please`);
            return -1;
        }
        let room = rooms[roomIndex];
        let roomElem = document.getElementById(`room${room.ID}`);

        while (isRoomFull(roomElem)) {
            if (++roomIndex >= rooms.length) {
                showAlert("Not enought space", `There is not enought rooms for your team.
                <br>Contact organiser please`);
                return -1;
            }

            room = rooms[roomIndex];
            roomElem = document.getElementById(`room${room.ID}`);
        }

        jbs[i].ROOM_ID = room.ID;
        buildRoomDiv();
    }
    return roomIndex + 1;
}

function resetBeds() {
    for (let i = 0; i < jbs.length; i++) {
        jbs[i].ROOM_ID = -1;
    }
    buildAccTable();
    buildRoomDiv();
}

function startAcc(e) {
    if (!e.target.id.startsWith("personForBed")) return;

    dragged = e.target.id.replace("personForBed", "");
}

function dragAcc(e) {
    if (!e.target.classList.contains("accRoomRoomDiv")) return;
    if (!isRoomFull(e.target)) {
        e.target.classList.add("dragover");
    }
    else {
        e.target.classList.add("dragoverfull");
    }
}

function dropAcc(e) {
    if (!e.target.classList.contains("accRoomRoomDiv")) return;

    let roomId = e.target.id.replace("room", "");

    if (isRoomFull(e.target)) {
        showWrongAlert("No space", "This room is full", alertTime);
        return;
    }
    
    jbs[dragged].ROOM_ID = roomId;

    buildAccTable();
    buildRoomDiv();
}