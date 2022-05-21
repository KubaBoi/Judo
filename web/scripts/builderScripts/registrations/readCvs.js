
var cvsContents = null;
function clickElem(elem) {
    var eventMouse = document.createEvent("MouseEvents")
    eventMouse.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    elem.dispatchEvent(eventMouse)
}
function openFile() {
    readFile = function(e) {
        var file = e.target.files[0];
        if (!file) {
            return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            var contents = e.target.result;
            fileInput.func(contents)
            document.body.removeChild(fileInput)
        }
        reader.readAsText(file)
    }
    fileInput = document.createElement("input")
    fileInput.type='file'
    fileInput.style.display='none'
    fileInput.onchange=readFile
    fileInput.func=readCvsFromFile
    document.body.appendChild(fileInput)
    clickElem(fileInput)
}

var cvsContents = [];
function readCvsFromFile(contents) {
    cvsContents = [];
    let lines = contents.split("\n");

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (line == "") continue;

        groups = line.split("\t");

        let brth = groups[7].split(".");
        brth = `${brht[2]}-${brht[1]}-${brht[2]}`;

        let row = {
            "JB": groups[1],
            "SUR_NAME": groups[2],
            "NAME": groups[3],
            "STATE": groups[4],
            "BIRTHDAY": brth,
            "FUNCTION": groups[8],
            "GENDER": groups[9]
        };
        cvsContents.push(row);
    }

    buildJbTable();
}

function buildJbTable() {
    var tbl = document.getElementById("jbsTable");
    document.getElementById("uploadLabel").remove();
    document.getElementById("countLabel").innerHTML = `Found ${cvsContents.length} records`;

    for (let i = 0; i < cvsContents.length; i++) {
        let row = cvsContents[i];

        addRow(tbl, [
            {"text": row.JB},
            {"text": row.SUR_NAME},
            {"text": row.NAME},
            {"text": row.STATE},
            {"text": row.BIRTHDAY},
            {"text": row.FUNCTION},
            {"text": row.GENDER}
        ]);
    }
}