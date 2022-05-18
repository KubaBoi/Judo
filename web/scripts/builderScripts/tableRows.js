function createEditTableRow(tbl, label, id, defValue, type="text") {
    var row = createElement("tr", tbl);
    createElement("td", row, label);
    var value = createElement("td", row);
    createEditTableInput(value, id, defValue, type);
}

function createEditTableRowMulti(tbl, label, cells=[{"id": "id", "defValue": "defValue", "type": "text"}]) {
    var row = createElement("tr", tbl);
    createElement("td", row, label);
    for (let i = 0; i < cells.length; i++) {
        var value = createElement("td", row);
        createEditTableInput(value, cells[i].id, cells[i].defValue, cells[i].type);
    }
}

function createEditTableInput(parent, id, defValue, type) {
    cls = "textBox";

    var input = createElement("input", parent, "", 
    [
        {"name": "id", "value": id},
        {"name": "type", "value": type},
        {"name": "value", "value": defValue},
        {"name": "class", "value": cls}
    ]);
    return input;
}

// SHOW

function createShowTableRow(tbl, label, defValue) {
    var row = createElement("tr", tbl);
    createElement("td", row, label);
    createElement("td", row, defValue);
}

function createShowTableRowHeader(tbl, label, defValue) {
    var row = createElement("tr", tbl);
    createElement("th", row, label);
    createElement("th", row, defValue);
}

function createShowTableRowMulti(tbl, label, cells=[]) {
    var row = createElement("tr", tbl);
    createElement("td", row, label);
    for (let i = 0; i < cells.length; i++) {
        createElement("td", row, cells[i]);
    }
}