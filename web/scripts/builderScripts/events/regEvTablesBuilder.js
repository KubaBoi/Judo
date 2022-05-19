var jbs = [];
async function buildRegEvTables() {
    showLoader();
    // PEOPLE
    await buildPeopleTable(
        ["", "Name", "State", "Birthday", "Function", "Gender", "Passport number", "Passport release", "Passport expiration"],
        ["-checkbox", "SUR_NAME,NAME", "STATE", "BIRTHDAY", "FUNCTION", "GENDER", "PASS_ID", "PASS_RELEASE", "PASS_EXPIRATION"]
    );

    // ACCOMMODATIONS
    buildAccTable();

    hideLoader();
}

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
            let item = items[i];

            prepItem = [];
            for (let o = 0; o < attrs.length; o++) {
                let attr = attrs[o];
                let itm = "";
                if (attr.startsWith("-")) {
                    attr = attr.replace("-", "");
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
                }
                prepItem.push({"text": itm});
            } 

            addRow(tbl, prepItem, [
                {"name": "id"}
            ]);

            jbs[i].ISIN = true;

            let checkbox = document.getElementById(`checkbox${i}`);
            checkbox.addEventListener("change", function(){changeJbArray(checkbox, i)});
        }
    }
}

function allChangeJbArray(check=false) {
    for (let i = 0; i < jbs.length; i++) {
        var checkbox = document.getElementById(`checkbox${i}`);
        checkbox.checked = check;
        changeJbArray(checkbox, i, false);
    }
    buildAccTable();
}

function changeJbArray(e, index, rewriteTables=true) {
    jbs[index].ISIN = e.checked;
    if (rewriteTables) {
        buildAccTable();
    }
} 

function buildAccTable() {
    let tbl = document.getElementById("accPeopleTable");
    clearTable(tbl);

    for (let i = 0; i < jbs.length; i++) {
        let jb = jbs[i];
        if (jb.ISIN) {
            addRow(tbl, [
                {"text": jb.SUR_NAME + " " + jb.NAME}
            ]);
        }
    }
}