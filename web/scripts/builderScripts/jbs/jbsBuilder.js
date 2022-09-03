var localJbs = [];
var searchLock = false;

async function buildJbsTable() {
    showLoader();

    let countrySearchInp = createElementFromHTML(countryCodes);
    countrySearchInp.setAttribute("id", "countrySearchInp");
    countrySearchInp.setAttribute("onchange", "searchJbs()");
    countrySearchInp.setAttribute("class", "textBoxLight");
    document.getElementById("countrySearchInpTd").innerHTML = countrySearchInp.outerHTML;

    let functionSearchInp = createElementFromHTML(functionsCodes);
    functionSearchInp.setAttribute("id", "functionsSearchInp");
    functionSearchInp.setAttribute("onchange", "searchJbs()");
    document.getElementById("funcSearchInpTd").innerHTML = functionSearchInp.outerHTML;

    let response = await callEndpoint("GET", "/jb/getAll");
    if (response.ERROR == null) {
        localJbs = response.JBS;
        buildJbsLocalTable(response.JBS);
    }
    else {
        showErrorAlert(response.ERROR, alertTime);
    }

    hideLoader();
    newContent("jbAdministrationDiv");
}

function buildJbsLocalTable(jbs) {
    let jbTable = document.getElementById("jbsTable");
    clearTable(jbTable);

    document.getElementById("totalJbsLbl").innerHTML = `Total results: ${localJbs.length}`;
    document.getElementById("shownJbsLbl").innerHTML = `Searched results: ${jbs.length}`;

    addHeader(jbTable, [
        {"text": "Country"},
        {"text": "Last name"},
        {"text": "First name"},
        {"text": "Function"},
        {"text": "Passport ID"},
        {"text": "Passport release"},
        {"text": "Passport expiration"},
        {"text": "JudoBase ID"}
    ]);

    for (let i = 0; i < jbs.length; i++) {
        let jb = jbs[i];
        
        let functionSelectInp = createElementFromHTML(functionsCodes);
        functionSelectInp.setAttribute("id", `funcSelInp${i}`);

        addRow(jbTable, [
            {"text": getImage(jb.STATE)},
            {"text": `<input type="text" value="${jb.SUR_NAME}" id="lastNameInp${i}" class="textBoxLight">`},
            {"text": `<input type="text" value="${jb.NAME}" id="firstNameInp${i}" class="textBoxLight">`},
            {"text": functionSelectInp.outerHTML},// `<div class="custom-select">${functionSelectInp.outerHTML}</div>`},
            {"text": `<input type="text" value="${(jb.PASS_ID == null) ? '' : jb.PASS_ID}" id="passIdInp${i}" class="textBoxLight">`},
            {"text": `<input type="date" value="${jb.PASS_RELEASE}" id="passRelInp${i}" class="textBoxLight">`},
            {"text": `<input type="date" value="${jb.PASS_EXPIRATION}" id="passExpInp${i}" class="textBoxLight">`},
            {"text": jb.JB}
        ]);

        let lastNameInp = document.getElementById(`lastNameInp${i}`);
        let firstNameInp = document.getElementById(`firstNameInp${i}`);
        let funcSelInp = document.getElementById(`funcSelInp${i}`);
        let passIdInp = document.getElementById(`passIdInp${i}`);
        let passRelInp = document.getElementById(`passRelInp${i}`);
        let passExpInp = document.getElementById(`passExpInp${i}`);

        funcSelInp.value = jb.FUNCTION;

        lastNameInp.addEventListener("change", function(){jbOnChange(jb.ID, i);});
        firstNameInp.addEventListener("change", function(){jbOnChange(jb.ID, i);});
        funcSelInp.addEventListener("change", function(){jbOnChange(jb.ID, i);});
        passIdInp.addEventListener("change", function(){jbOnChange(jb.ID, i);});
        passRelInp.addEventListener("change", function(){jbOnChange(jb.ID, i);});
        passExpInp.addEventListener("change", function(){jbOnChange(jb.ID, i);});
    }
    //prepareSelect();
}

async function jbOnChange(id, index) {
    let lastNameInp = document.getElementById(`lastNameInp${index}`);
    let firstNameInp = document.getElementById(`firstNameInp${index}`);
    let funcSelInp = document.getElementById(`funcSelInp${index}`);
    let passIdInp = document.getElementById(`passIdInp${index}`);
    let passRelInp = document.getElementById(`passRelInp${index}`);
    let passExpInp = document.getElementById(`passExpInp${index}`);

    let req = {
        "ID": id,
        "SUR_NAME": lastNameInp.value,
        "NAME": firstNameInp.value,
        "FUNCTION": (funcSelInp.value == "") ? "Others" : funcSelInp.value,
        "PASS_ID": passIdInp.value,
        "PASS_RELEASE": (passRelInp.value == "") ? null : passRelInp.value,
        "PASS_EXPIRATION": (passExpInp.value == "") ? null : passExpInp.value
    };
    
    let response = await callEndpoint("POST", "/jb/update", req);
    if (response.ERROR != null) {
        showErrorAlert(response.ERROR, alertTime);
    }
}

function searchJbs() {
    if (searchLock) return;

    let lastName = document.getElementById("lastNameSearchInp").value;
    let country = document.getElementById("countrySearchInp").value;
    let func = document.getElementById("functionsSearchInp").value;

    if (lastName == "" && country == "" && func == "") {
        buildJbsLocalTable(localJbs);
        return;
    }
    
    let searchedJbs = [];
    for (let i = 0; i < localJbs.length; i++) {
        let add = false;
        let jb = localJbs[i];
        
        if (lastName != "") {
            add = jb.SUR_NAME.toUpperCase().startsWith(lastName.toUpperCase());
        }
        else if (lastName == "") add = true;

        if (country != "" && add) {
            add = jb.STATE == country;
        }

        if (func != "" && add) {
            add = jb.FUNCTION == func;
        }

        if (add) {
            searchedJbs.push(jb);
        }
    }

    buildJbsLocalTable(searchedJbs);
}

function clearJbSearch() {
    if (document.getElementById("lastNameSearchInp").value == "" &&
        document.getElementById("countrySearchInp").value == "" &&
        document.getElementById("lastNameSearchInp").value == "") {
        return;
    }
    searchLock = true;
    document.getElementById("lastNameSearchInp").value = "";
    document.getElementById("countrySearchInp").value = "";
    document.getElementById("functionsSearchInp").value = "";
    searchLock = false;
    searchJbs();
}