var dragged = -1;

function dragStart(e) {
    if (!e.target.id.startsWith("personForBed")) return;

    dragged = e.target.id.replace("personForBed", "");
}

function dragEnter(e) {
    e.preventDefault();
    if (!e.target.classList.contains("accRoomRoomDiv")) return;
    e.target.classList.add("accRoomRoomDivDragOver");
}

function dragOver(e) {
    e.preventDefault();
    if (!e.target.classList.contains("accRoomRoomDiv")) return;
    e.target.classList.add("accRoomRoomDivDragOver");
}

function dragLeave(e) {
    if (!e.target.classList.contains("accRoomRoomDiv")) return;
    e.target.classList.remove("accRoomRoomDivDragOver");
}

function drop(e) {
    if (!e.target.classList.contains("accRoomRoomDiv")) return;
    e.target.classList.remove("accRoomRoomDivDragOver");
    
    let roomData = e.target.id.replace("room", "").split("-");
    let roomId = roomData[0];

    let roomTable = document.getElementById(`roomTable${roomId}`);
    let rows = roomTable.querySelectorAll("td");
    
    if (rows.length >= roomData[1]) {
        showWrongAlert("No space", "This room is full", alertTime);
        return;
    }

    jbs[dragged].ROOM_ID = roomId;

    buildAccTable();
    buildRoomDiv();
}




document.addEventListener("dragstart", dragStart);
document.addEventListener("dragover", dragOver);
document.addEventListener("dragleave", dragLeave);
document.addEventListener("dragenter", dragEnter);
document.addEventListener("drop", drop);