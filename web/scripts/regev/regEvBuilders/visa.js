
function buildVisaTable() {
    let visaTable = document.getElementById("regEvVisaTable");
    clearTable(visaTable);

    let startDate = new Date(activeEvent.EVENT_START);
    let endDate = new Date(activeEvent.EVENT_END);
    let weekdayArray = [];

    while (startDate.getTime() <= endDate.getTime()) {
        weekdayArray.push(weekday[startDate.getDay()]);
        startDate.setDate(startDate.getDate() + 1);
    }

    addHeader(visaTable, [
        {"text": "Needs visa"},
        {"text": "Name"},
        {"text": "Passport number"},
        {"text": "Passport release"},
        {"text": "Passport expiration"},
        {"text": "Rooming list"},
        {"text": "Packages"}
    ]);

    for (let i = 0; i < jbs.length; i++) {
        let jb = jbs[i];
        
        if (!jb.ISIN) continue;
        if (jb.ROOM_ID == -1) continue;

        hdrRow = document.getElementById(`headerRow${jb.ROOM_ID}`);
        if (hdrRow == null) {
            hdrRow = addHeader(visaTable, [
                {"text": `Room ${jb.ROOM_ID}`}
            ], [
                {"name": "id", "value": `headerRow${jb.ROOM_ID}`}
            ]);
        }
        hdrRowIndex = hdrRow.rowIndex+1;
        insertRow(visaTable, hdrRowIndex, [
            {"text": `<input type="checkbox" id="visacheck${i}">`},
            {"text": jb.SUR_NAME + " " + jb.NAME},
            {"text": `<input type="text" class="textBoxLight" id="passNumInp${i}">`},
            {"text": `<input type="date" class="textBoxLight" id="passRelInp${i}">`},
            {"text": `<input type="date" class="textBoxLight" id="passExpInp${i}">`},
            {"text": `<div id=roomingCheck${i} class=roomingDivCls></div>`},
            {"text": `<div id=packageCheck${i} class=packageDivCls></div>`}
        ]);

        let chb = document.getElementById(`visacheck${i}`);
        chb.checked = jb.NEED_VISA;

        let passNumInp = document.getElementById(`passNumInp${i}`);
        passNumInp.value = jb.PASS_ID;

        let passRelInp = document.getElementById(`passRelInp${i}`);
        passRelInp.value = getDate(jb.PASS_RELEASE, false);

        let passExpInp = document.getElementById(`passExpInp${i}`);
        passExpInp.value = getDate(jb.PASS_EXPIRATION, false);

        let roomingCheck = document.getElementById(`roomingCheck${i}`);
        for (let o = 0; o < weekdayArray.length; o++) {
            createElement("button", roomingCheck, weekdayArray[o], [
                {"name": "class", "value": "smlChecked"},
                {"name": "onclick", "value": `addDay(this)`}
            ]);
        }

        let packageCheck = document.getElementById(`packageCheck${i}`);
        createElement("button", packageCheck, "BB", [
            {"name": "onclick", "value": "changePackage(this)"},
            {"name": "title", "value": "Bed and Breakfast"},
            {"name": "class", "value": "checkedPackage"}
        ]);
        createElement("button", packageCheck, "HB", [
            {"name": "onclick", "value": "changePackage(this)"},
            {"name": "title", "value": "Half Board"}
        ]);
        createElement("button", packageCheck, "FB", [
            {"name": "onclick", "value": "changePackage(this)"},
            {"name": "title", "value": "Full Board"}
        ]);
        createElement("button", packageCheck, "LIV", [
            {"name": "onclick", "value": "changePackage(this)"},
            {"name": "title", "value": "Lunch In Venue"}
        ]);


        chb.addEventListener("change", function(){needVisa(i)});
        passNumInp.addEventListener("change", function(){needVisa(i)});
        passRelInp.addEventListener("change", function(){needVisa(i)});
        passExpInp.addEventListener("change", function(){needVisa(i)});
    }

    checkIfDoneVisa();
}

function allNeedVisa(need=false) {
    for (let i = 0; i < jbs.length; i++) {
        if (!jbs[i].ISIN) continue;
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
    jbs[index].ROOMING_LIST = "";
    jbs[index].PACKAGE = "";

    if (confirmedVisa) {
        confirmVisa();
    }

    checkIfDoneVisa();
}

function addDay(button) {
    if (button.classList.contains("sml")) {
        button.classList.remove("sml");  
    }
    else {
        button.classList.add("sml");
    }
}

function changePackage(button) {
    let parent = button.parentNode;
    let buttons = parent.getElementsByTagName("button");

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("checkedPackage");
    }

    button.classList.add("checkedPackage");
}

function checkIfDoneVisa() {

    for (let i = 0; i < jbs.length; i++) {
        if (!jbs[i].ISIN) continue;
        if (jbs[i].ROOM_ID == -1) {
            changeNotification(2, "notifPend", `There are some participants which are not assigned to any room.`);
            return false;
        }

        let visaCheck = document.getElementById(`visacheck${i}`);
        let passNum = document.getElementById(`passNumInp${i}`);
        let passRel = document.getElementById(`passRelInp${i}`);
        let passExp = document.getElementById(`passExpInp${i}`);

        if (visaCheck.checked) {
            if (passNum.value == "" ||
                passRel.value == "" ||
                passExp.value == "") {
                    changeNotification(2, "notifPend", "Someone needs visa but does not have filled passport properties");
                    return false;
            }
        }
    }

    changeNotification(2, "notifPend", "Confirm, so we know you are sure");
    return true;
}

let confirmedVisa = false;
function confirmVisa() {
    let div = document.getElementById("visaSwitchDiv");
    let border = div.getElementsByClassName("switchBorder")[0];
    let button = div.getElementsByClassName("switchButton")[0];

    if (confirmedVisa) {
        button.style.animationName = "switchUnlock";
        button.style.animationDuration = "0.2s";
        button.style.animationFillMode = "forwards";

        border.style.animationName = "switchUnlockBorder";
        border.style.animationDuration = "0.2s";
        border.style.animationFillMode = "forwards";
        
        changeNotification(2, "notifPend");
        confirmedVisa = false;
    }
    else {
        button.style.animationName = "switchLock";
        button.style.animationDuration = "0.2s";
        button.style.animationFillMode = "forwards";

        border.style.animationName = "switchLockBorder";
        border.style.animationDuration = "0.2s";
        border.style.animationFillMode = "forwards";

        confirmedVisa = true;

        if (!checkIfDoneVisa()) {
            showNotifError(2);
            chooseRegTab(document.getElementById("regTabB2"), "visaDiv");
            setTimeout(confirmVisa, 500);
        }
        else {
            changeNotification(2, "notifDone", "Done");
        }
    }
}