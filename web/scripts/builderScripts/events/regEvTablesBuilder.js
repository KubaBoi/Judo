var jbs = []; // all jbs
var rooms = [];

async function buildRegEvTables(event) {
    showLoader();
    // PEOPLE
    await buildPeopleTable(
        ["", "Name", "State", "Birthday", "Function", "Gender", "Passport number", "Passport release", "Passport expiration"],
        ["-checkbox", "SUR_NAME,NAME", "STATE", "BIRTHDAY", "FUNCTION", "GENDER", "PASS_ID", "PASS_RELEASE", "PASS_EXPIRATION"]
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

    // ACCOMMODATIONS
    buildAccTable();
    buildRoomDiv();

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
            let prepItem = preparePeople(items[i], attrs, i);
            addRow(tbl, prepItem, [
                {"name": "id"}
            ]);
        
            jbs[i].ISIN = true;
            jbs[i].ROOM_ID = -1;
        
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

    return prepItem
}

function allChangeJbArray(check=false) {
    for (let i = 0; i < jbs.length; i++) {
        var checkbox = document.getElementById(`checkbox${i}`);
        checkbox.checked = check;
        changeJbArray(checkbox, i, false);
    }
    buildAccTable();
    buildRoomDiv();
}

function changeJbArray(e, index, rewriteTables=true) {
    jbs[index].ISIN = e.checked;
    if (rewriteTables) {
        buildAccTable();
        buildRoomDiv();
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
    
    let width = "110px ";
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
    buildAccTable();
    buildRoomDiv();
}