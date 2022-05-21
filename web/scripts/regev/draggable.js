var dragged = -1;

function dragStart(e) {
    if (!e.target.id.startsWith("personForBed")) return;

    dragged = e.target.id.replace("personForBed", "");
}

function dragEnter(e) {
    e.preventDefault();
    // ACCOMMODATIONS
    if (e.target.classList.contains("accRoomRoomDiv")) {
        if (!isRoomFull(e.target)) {
            e.target.classList.add("dragover");
        }
        else {
            e.target.classList.add("dragoverfull");
        }
    }
}

function dragOver(e) {
    e.preventDefault();
    // ACCOMMODATIONS
    if (e.target.classList.contains("accRoomRoomDiv")) {
        if (!isRoomFull(e.target)) {
            e.target.classList.add("dragover");
        }
        else {
            e.target.classList.add("dragoverfull");
        }
    }
}

function dragLeave(e) {
    e.target.classList.remove("dragover");
    e.target.classList.remove("dragoverfull");
}

function drop(e) {
    if (!e.target.classList.contains("accRoomRoomDiv")) return;
    e.target.classList.remove("dragover");
    e.target.classList.remove("dragoverfull");
    
    let roomId = e.target.id.replace("room", "");

    if (isRoomFull(e.target)) {
        showWrongAlert("No space", "This room is full", alertTime);
        return;
    }

    jbs[dragged].ROOM_ID = roomId;

    rebuildRegEvTables();
}




document.addEventListener("dragstart", dragStart);
document.addEventListener("dragover", dragOver);
document.addEventListener("dragleave", dragLeave);
document.addEventListener("dragenter", dragEnter);
document.addEventListener("drop", drop);