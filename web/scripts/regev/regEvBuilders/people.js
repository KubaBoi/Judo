
async function buildPeopleTable(header, attrs) {
    let tbl = document.getElementById("regEvPeopleTable");
    clearTable(tbl);

    let response = await callEndpoint("GET", `/jb/getByClub?clubId=${loggedClub.ID}`);
    if (response.ERROR == null) {
        let items = response.JBS;
        jbs = items;

        prepHeader = [];
        for (let i = 0; i < header.length; i++) {
            prepHeader.push({"text": header[i]});
        }

        addHeader(tbl, prepHeader);

        for (let i = 0; i < items.length; i++) {
            let prepItem = preparePeople(items[i], attrs, i);
            addRow(tbl, prepItem, [
                {"name": "id"}
            ]);
        
            jbs[i].ISIN = true;
            jbs[i].ROOM_ID = -1;
            jbs[i].NEED_VISA = false;
            jbs[i].ARR_FLIGHT = -1;
            jbs[i].DEP_FLIGHT = -1;
        
            let checkbox = document.getElementById(`checkbox${i}`);
            checkbox.addEventListener("change", function(){changeJbArray(checkbox, i)});
        }
    }
}

function preparePeople(item, attrs, i) {
    prepItem = [];
    for (let o = 0; o < attrs.length; o++) {
        let attr = attrs[o];
        let itm = "";
        if (attr == "checkbox") {
            let checkbox = createElement("input", null, "", [
                {"name": "type", "value": attr},
                {"name": "id", "value": `${attr}${i}`},
                {"name": "checked", "value": true}
            ]);

            itm = checkbox.outerHTML;
        }
        else {
            parts = attr.split(",");
            for (let u = 0; u < parts.length; u++) {
                itm += item[parts[u]];
                if (u < parts.length - 1) {
                    itm += " ";
                }
            }

            if (attr == "SUR_NAME,NAME") {
                let img = createElement("img", null, "", [
                    {"name": "src", "value": `./images/${item['GENDER']}Icon.png`}
                ]);
    
                itm += " " + img.outerHTML;
            }
        }
        prepItem.push({"text": itm});
    } 

    return prepItem
}

function allChangeJbArray(check=false) {
    for (let i = 0; i < jbs.length; i++) {
        var checkbox = document.getElementById(`checkbox${i}`);
        checkbox.checked = check;
        changeJbArray(checkbox, i, false);
    }
    rebuildRegEvTables();
}

function changeJbArray(e, index, rewriteTables=true) {
    jbs[index].ISIN = e.checked;
    if (rewriteTables) {
        rebuildRegEvTables();
    }
} 