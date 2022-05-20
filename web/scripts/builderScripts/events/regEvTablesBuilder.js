var jbs = []; // all jbs
var rooms = [];
var regEvTablesDiv = null;

// scroll events
function onscrollDiv() {
    var pos = regEvTablesDiv.scrollTop;

    let peoplePos = document.getElementById("peopleDiv").scrollHeight;
    let accoPos = document.getElementById("accDiv").scrollHeight;
    let visaPos = document.getElementById("visaDiv").scrollHeight;
    let flightPos = document.getElementById("flightDiv").scrollHeight;
    let billPos = document.getElementById("billingDiv").scrollHeight;

    let btn = document.getElementById("regTabB0");

    if (peoplePos >= pos) {
        btn = document.getElementById("regTabB0");
    }
    else if (peoplePos + accoPos >= pos) {
        btn = document.getElementById("regTabB1");
    }
    else if (peoplePos + accoPos + visaPos >= pos) {
        btn = document.getElementById("regTabB2");
    }
    else if (peoplePos + accoPos + visaPos + flightPos >= pos) {
        btn = document.getElementById("regTabB3");
    }
    else if (peoplePos + accoPos + visaPos + flightPos + billPos >= pos) {
        btn = document.getElementById("regTabB4");
    }
    changeButton(btn);
}

function changeButton(button) {
    var buttons = document.getElementsByClassName("regTabButton");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("regTabButtonChosen");
    }
    button.classList.add("regTabButtonChosen");
}

function chooseRegTab(button, divId="peopleDiv") {
    changeButton(button, divId);
    let div = document.getElementById(divId);
    div.scrollIntoView();
    document.body.scrollTo(0, 0);
}




async function buildRegEvTables(event) {
    regEvTablesDiv = document.getElementById("regEvTablesDiv");
    regEvTablesDiv.onscroll = onscrollDiv;

    showLoader();
    
    await buildPeopleTable(
        ["", "Name", "State", "Birthday", "Function"],
        ["checkbox", "SUR_NAME,NAME", "STATE", "BIRTHDAY", "FUNCTION"]
    );

    rooms = [];
    let hotels = event.HOTELS.split(",");
    for (let i = 0; i < hotels.length; i++) {
        var response = await callEndpoint("GET", `/hotels/getAvailableRooms?hotelId=${hotels[i]}`);
        if (response.ERROR == null) {
            let rms = response.ROOMS;
            for (let o = 0; o < rms.length; o++) {
                rooms.push(rms[o]);
            }
        }
    }

    rebuildRegEvTables();

    hideLoader();
}

function rebuildRegEvTables() {
    buildAccTable();
    buildRoomDiv();
    buildVisaTable();
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
            let prepItem = preparePeople(items[i], attrs, i);
            addRow(tbl, prepItem, [
                {"name": "id"}
            ]);
        
            jbs[i].ISIN = true;
            jbs[i].ROOM_ID = -1;
            jbs[i].NEED_VISA = false;
        
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

function buildVisaTable() {
    let visaTable = document.getElementById("regEvVisaTable");
    clearTable(visaTable);

    addHeader(visaTable, [
        {"text": "Needs visa"},
        {"text": "Name"},
        {"text": "Passport number"},
        {"text": "Passport release"},
        {"text": "Passport expiration"}
    ]);

    for (let i = 0; i < jbs.length; i++) {
        let jb = jbs[i];
        
        if (!jb.ISIN) continue;

        addRow(visaTable, [
            {"text": `<input type="checkbox" id="visacheck${i}">`},
            {"text": jb.SUR_NAME + " " + jb.NAME},
            {"text": `<input type="text" class="textBox" id="passNumInp${i}">`},
            {"text": `<input type="datetime-local" class="textBox" id="passRelInp${i}">`},
            {"text": `<input type="datetime-local" class="textBox" id="passExpInp${i}">`}
        ]);

        let chb = document.getElementById(`visacheck${i}`);
        chb.checked = jb.NEED_VISA;

        let passNumInp = document.getElementById(`passNumInp${i}`);
        passNumInp.value = jb.PASS_ID;

        let passRelInp = document.getElementById(`passRelInp${i}`);
        passRelInp.value = new Date(jb.PASS_RELEASE).toISOString().slice(0,16);

        let passExpInp = document.getElementById(`passExpInp${i}`);
        passExpInp.value = new Date(jb.PASS_EXPIRATION).toISOString().slice(0,16);


        chb.addEventListener("change", function(){needVisa(i)});
        passNumInp.addEventListener("change", function(){needVisa(i)});
        passRelInp.addEventListener("change", function(){needVisa(i)});
        passExpInp.addEventListener("change", function(){needVisa(i)});
    }
}

function allNeedVisa(need=false) {
    for (let i = 0; i < jbs.length; i++) {
        let checkbox = document.getElementById(`visacheck${i}`);

        checkbox.checked = need;
        needVisa(i);
    }
}

function needVisa(index) {
    jbs[index].NEED_VISA = document.getElementById(`visacheck${index}`).checked;
    jbs[index].PASS_ID = document.getElementById(`passNumInp${index}`).value;
    jbs[index].PASS_RELEASE = document.getElementById(`passRelInp${index}`).value;
    jbs[index].PASS_EXPIRATION = document.getElementById(`passExpInp${index}`).value;
}