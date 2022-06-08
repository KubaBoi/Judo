function buildVisaTable() {
    let visaTable = document.getElementById("regEvVisaTable");
    clearTable(visaTable);

    addHeader(visaTable, [
        {"text": "Needs visa"},
        {"text": "Name"},
        {"text": "Passport number"},
        {"text": "Passport release"},
        {"text": "Passport expiration"},
        {"text": "Rooming list"},
        {"text": "Packages"}
    ]);

    let startDate = new Date(activeEvent.EVENT_START);
    let endDate = new Date(activeEvent.EVENT_END);
    let weekdayArray = [];

    while (startDate.getTime() <= endDate.getTime()) {
        weekdayArray.push(weekday[startDate.getDay()]);
        startDate.setDate(startDate.getDate() + 1);
    }

    for (let i = 0; i < jbs.length; i++) {
        let jb = jbs[i];
        
        if (!jb.ISIN) continue;

        addRow(visaTable, [
            {"text": `<input type="checkbox" id="visacheck${i}">`},
            {"text": jb.SUR_NAME + " " + jb.NAME},
            {"text": `<input type="text" class="textBoxLight" id="passNumInp${i}">`},
            {"text": `<input type="date" class="textBoxLight" id="passRelInp${i}">`},
            {"text": `<input type="date" class="textBoxLight" id="passExpInp${i}">`},
            {"text": `<div id=roomingCheck${i} class=roomingDivCls><div>`},
            {"text": `<div id=packageCheck${i} class=packageDivCls><div>`}
        ]);

        let chb = document.getElementById(`visacheck${i}`);
        chb.checked = jb.NEED_VISA;

        let passNumInp = document.getElementById(`passNumInp${i}`);
        passNumInp.value = jb.PASS_ID;

        let passRelInp = document.getElementById(`passRelInp${i}`);
        passRelInp.value = getTime(jb.PASS_RELEASE);

        let passExpInp = document.getElementById(`passExpInp${i}`);
        passExpInp.value = getTime(jb.PASS_EXPIRATION);

        let roomingCheck = document.getElementById(`roomingCheck${i}`);
        for (let o = 0; o < weekdayArray.length; o++) {
            createElement("button", roomingCheck, weekdayArray[o], [
                {"name": "class", "value": "smlChecked"}
            ]);
        }

        let packageCheck = document.getElementById(`packageCheck${i}`);
        createElement("button", packageCheck, "BB");
        createElement("button", packageCheck, "HB");
        createElement("button", packageCheck, "FB");
        createElement("button", packageCheck, "LIV");


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