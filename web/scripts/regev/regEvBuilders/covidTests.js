
function buildCovidTestsTable() {
    let covidTestsTable = document.getElementById("regEvCovidTestsTable");
    clearTable(covidTestsTable);
    lockCovidTests();

    addHeader(covidTestsTable, [
        {"text": "Name"},
        {"text": "PCR tests"},
        {"text": "AG tests"},
    ]);

    let pcrTestsInp = new NumberInput(`pcrTestsInpAll`, 0, null, null, "All");
    let agTestsInp = new NumberInput(`agTestsInpAll`, 0, null, null, "All");

    addNumberInput(pcrTestsInp);
    addNumberInput(agTestsInp);

    addHeader(covidTestsTable, [
        {"text": ""},
        {"text": pcrTestsInp.getElementOuterHtml()},
        {"text": agTestsInp.getElementOuterHtml()},
    ]);

    pcrTestsInp.setChange(function(){changeCovidTestsAll(this)});
    agTestsInp.setChange(function(){changeCovidTestsAll(this)});

    for (let i = 0; i < jbs.length; i++) {
        let jb = jbs[i];
        
        if (!jb.ISIN) continue;

        let pcrTestsInp = new NumberInput(`pcrTestsInp${i}`, jb.PCR_TESTS, 1);
        let agTestsInp = new NumberInput(`agTestsInp${i}`, jb.AG_TESTS, 0);

        addNumberInput(pcrTestsInp);
        addNumberInput(agTestsInp);

        addRow(covidTestsTable, [
            {"text": jb.SUR_NAME + " " + jb.NAME},
            {"text": pcrTestsInp.getElementOuterHtml()},
            {"text": agTestsInp.getElementOuterHtml()},
        ]);

        pcrTestsInp.setChange(function(){changeCovidTests(i)});
        agTestsInp.setChange(function(){changeCovidTests(i)});

        pcrTestsInp.change();
        agTestsInp.change();
    }
    checkExisting();

    checkIfDoneCovidTests();
}

function resetPcrTests() {
    for (let i = 0; i < jbs.length; i++) {
        let jb = jbs[i];
        if (!jb.ISIN) continue;
        jb.PCR_TESTS = 1;
    }
    lockCovidTests();
    buildCovidTestsTable();
}

function resetAgTests() {
    for (let i = 0; i < jbs.length; i++) {
        let jb = jbs[i];
        if (!jb.ISIN) continue;
        jb.AG_TESTS = 0;
    }
    lockCovidTests();
    buildCovidTestsTable();
}

function changeCovidTestsAll(inp) {
    let idTemp = "pcrTestsInp";
    if (inp.id == "agTestsInpAll") idTemp = "agTestsInp";

    for (let i = 0; i < jbs.length; i++) {
        let jb = jbs[i];
        if (!jb.ISIN) continue;

        let oinp = getNumberInput(`${idTemp}${i}`);
        oinp.add(inp.getValue());
    }
    inp.value = 0;
}

function changeCovidTests(index) {
    jbs[index].PCR_TESTS = getNumberInput(`pcrTestsInp${index}`).getValue();
    jbs[index].AG_TESTS = getNumberInput(`agTestsInp${index}`).getValue();

    lockCovidTests();
    checkIfDoneCovidTests();
}

function checkIfDoneCovidTests() {

    for (let i = 0; i < jbs.length; i++) {
        if (!jbs[i].ISIN) continue;

        /*let pcrTestsInp = document.getElementById(`pcrTestsInp${i}`);
        let agTestsInp = document.getElementById(`agTestsInp${i}`);

        if (pcrTestsInp.value == "" ||
            agTestsInp.value == "") {
                changeNotification("notifCovidTests", "notifPend", "Something is missing");
                return false;
        }*/
    }

    changeNotification("notifCovidTests", "notifPend", "Confirm, so we know you are sure");
    return true;
}

let confirmedCovidTests = false;
function confirmCovidTests() {
    let div = document.getElementById("covidTestsSwitchDiv");
    let border = div.getElementsByClassName("switchBorder")[0];
    let button = div.getElementsByClassName("switchButton")[0];

    if (confirmedCovidTests) {
        button.style.animationName = "switchUnlock";
        button.style.animationDuration = "0.2s";
        button.style.animationFillMode = "forwards";

        border.style.animationName = "switchUnlockBorder";
        border.style.animationDuration = "0.2s";
        border.style.animationFillMode = "forwards";
        
        checkIfDoneCovidTests();
        confirmedCovidTests = false;
    }
    else {
        button.style.animationName = "switchLock";
        button.style.animationDuration = "0.2s";
        button.style.animationFillMode = "forwards";

        border.style.animationName = "switchLockBorder";
        border.style.animationDuration = "0.2s";
        border.style.animationFillMode = "forwards";

        confirmedCovidTests = true;

        if (!checkIfDoneCovidTests()) {
            showNotifError("notifCovidTests");
            chooseRegTab(document.getElementById("regTabB3"), "covidTestsDiv");
            setTimeout(lockCovidTests, 500);
        }
        else {
            changeNotification("notifCovidTests", "notifDone", "Done");
        }
    }
}

function lockCovidTests() {
    let div = document.getElementById("covidTestsSwitchDiv");
    let border = div.getElementsByClassName("switchBorder")[0];
    let button = div.getElementsByClassName("switchButton")[0];

    button.style.animationName = "switchUnlock";
    button.style.animationDuration = "0.2s";
    button.style.animationFillMode = "forwards";

    border.style.animationName = "switchUnlockBorder";
    border.style.animationDuration = "0.2s";
    border.style.animationFillMode = "forwards";

    confirmedCovidTests = false;
}