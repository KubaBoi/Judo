var dragged = -1;

function dragStart(e) {
    startAcc(e);
    startArr(e);
    startDep(e);
}

function dragEnter(e) {
    e.preventDefault();
    dragAcc(e);
    dragArr(e);
    dragDep(e);
}

function dragOver(e) {
    e.preventDefault();
    dragAcc(e);
    dragArr(e);
    dragDep(e);
}

function dragLeave(e) {
    e.target.classList.remove("dragover");
    e.target.classList.remove("dragoverfull");
}

function drop(e) {
    e.target.classList.remove("dragover");
    e.target.classList.remove("dragoverfull");

    dropAcc(e);
    dropArr(e);
    dropDep(e);
}




document.addEventListener("dragstart", dragStart);
document.addEventListener("dragover", dragOver);
document.addEventListener("dragleave", dragLeave);
document.addEventListener("dragenter", dragEnter);
document.addEventListener("drop", drop);