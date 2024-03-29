function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
  
    // Change this to div.childNodes to support multiple top-level nodes.
    return div.firstChild;
  }

function createEditTableRow(tbl, label, id, defValue, type="text") {
    var row = createElement("tr", tbl);
    createElement("td", row, label);
    var vl = createElement("td", row);

    if (type == "datetime-local") {
        defValue = getTimestamp(defValue);
    }

    var element = createEditTableInput(vl, id, defValue, type);
    return element;
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

function createShowTableRowHeader(tbl, label, defValue=null) {
    var row = createElement("tr", tbl);
    if (defValue == null) {
        createElement("th", row, label, [
            {"name": "colspan", "value": 2}
        ]);
    }
    else {
        createElement("th", row, label);
        createElement("th", row, defValue);
    }
}

function createShowTableRowMulti(tbl, label, cells=[]) {
    var row = createElement("tr", tbl);
    createElement("td", row, label);
    for (let i = 0; i < cells.length; i++) {
        createElement("td", row, cells[i]);
    }
}