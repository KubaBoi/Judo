var localJbs = [];
var newJbRow = null;

async function buildJbsTable() {
    showLoader();

    let response = await callEndpoint("GET", "/jb/getAll");
    if (response.ERROR == null) {
        localJbs = response.JBS;
        reloadSearchSelect();
        buildJbsLocalTable(response.JBS);
    }
    else {
        showErrorAlert(response.ERROR, alertTime);
    }

    hideLoader();
    newContent("jbAdministrationDiv");
}

function buildJbsLocalTable(jbs) {
    let jbTable = document.getElementById("jbsAdmsTable");
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
        {"text": "Birthday"},
        {"text": "Gender"},
        {"text": "JudoBase ID"},
        {"text": ""}
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
            {"text": (!targetProxy.adminAccess) ? "Sensitive" : `<input type="text" value="${(jb.PASS_ID == null) ? '' : jb.PASS_ID}" id="passIdInp${i}" class="textBoxLight">`},
            {"text": (!targetProxy.adminAccess) ? "Sensitive" : `<input type="date" value="${jb.PASS_RELEASE}" id="passRelInp${i}" class="textBoxLight">`},
            {"text": (!targetProxy.adminAccess) ? "Sensitive" : `<input type="date" value="${jb.PASS_EXPIRATION}" id="passExpInp${i}" class="textBoxLight">`},
            {"text": `<input type="date" value="${jb.BIRTHDAY}" id="birthdayInp${i}" class="textBoxLight">`},
            {"text": `<select id="genderInp${i}" class="textBoxLight"><option value="m">Man</option><option value="w">Woman</option></select>`},
            {"text": jb.JB},
            {"text": `<img src='/images/deleteIcon48.png'>`, "attributes": [
                {"name": "class", "value": "smallCellLast"},
                {"name": "onclick", "value": `deleteJb(${jb.ID}, ${i})`}
            ]}
        ]);

        let lastNameInp = document.getElementById(`lastNameInp${i}`);
        let firstNameInp = document.getElementById(`firstNameInp${i}`);
        let funcSelInp = document.getElementById(`funcSelInp${i}`);
        let passIdInp = document.getElementById(`passIdInp${i}`);
        let passRelInp = document.getElementById(`passRelInp${i}`);
        let passExpInp = document.getElementById(`passExpInp${i}`);
        let birthdayInp = document.getElementById(`birthdayInp${i}`);
        let genderInp = document.getElementById(`genderInp${i}`);

        funcSelInp.value = jb.FUNCTION;
        genderInp.value = jb.GENDER;

        lastNameInp.addEventListener("change", function(){jbOnChange(jb.ID, i);});
        firstNameInp.addEventListener("change", function(){jbOnChange(jb.ID, i);});
        funcSelInp.addEventListener("change", function(){jbOnChange(jb.ID, i);});
        if (targetProxy.adminAccess) passIdInp.addEventListener("change", function(){jbOnChange(jb.ID, i);});
        if (targetProxy.adminAccess) passRelInp.addEventListener("change", function(){jbOnChange(jb.ID, i);});
        if (targetProxy.adminAccess) passExpInp.addEventListener("change", function(){jbOnChange(jb.ID, i);});
        birthdayInp.addEventListener("change", function(){jbOnChange(jb.ID, i);});
        genderInp.addEventListener("change", function(){jbOnChange(jb.ID, i);});
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
    let birthdayInp = document.getElementById(`birthdayInp${index}`);
    let genderInp = document.getElementById(`genderInp${index}`);

    let req = {
        "ID": id,
        "SUR_NAME": lastNameInp.value,
        "NAME": firstNameInp.value,
        "FUNCTION": (funcSelInp.value == "") ? "Others" : funcSelInp.value,
        "BIRTHDAY": (birthdayInp.value == "") ? null : birthdayInp.value,
        "GENDER": genderInp.value
    };

    let jbIndex = 0;
    for (let i = 0; i < localJbs.length; i++) {
        if (id == localJbs[i].ID) {
            jbIndex = i;
            break;
        }
    }

    localJbs[jbIndex].SUR_NAME = req.SUR_NAME;
    localJbs[jbIndex].NAME = req.NAME;
    localJbs[jbIndex].FUNCTION = req.FUNCTION;
    localJbs[jbIndex].BIRTHDAY = req.BIRTHDAY;
    localJbs[jbIndex].GENDER = req.GENDER;
    
    if (targetProxy.adminAccess) {
        req.PASS_ID = passIdInp.value;
        req.PASS_RELEASE = (passRelInp.value == "") ? null : passRelInp.value;
        req.PASS_EXPIRATION = (passExpInp.value == "") ? null : passExpInp.value;

        localJbs[jbIndex].PASS_ID = req.PASS_ID;
        localJbs[jbIndex].PASS_RELEASE = req.PASS_RELEASE;
        localJbs[jbIndex].PASS_EXPIRATION = req.PASS_EXPIRATION;
    }

    let response = await callEndpoint("POST", "/jb/update", req);
    if (response.ERROR != null) {
        showErrorAlert(response.ERROR, alertTime);
    }
}

function reloadSearchSelect() {
    let countrySearchInp = createElementFromHTML(countryCodes);
    countrySearchInp.setAttribute("id", "countrySearchInp");
    countrySearchInp.setAttribute("onchange", "searchJbs()");
    countrySearchInp.setAttribute("class", "textBoxLight");
    document.getElementById("countrySearchInpTd").innerHTML = countrySearchInp.outerHTML;

    let functionSearchInp = createElementFromHTML(functionsCodes);
    functionSearchInp.setAttribute("id", "functionsSearchInp");
    functionSearchInp.setAttribute("onchange", "searchJbs()");
    document.getElementById("funcSearchInpTd").innerHTML = functionSearchInp.outerHTML;

    let countries = [""];
    for (let i = 0; i < localJbs.length; i++) {
        let jb = localJbs[i];
        if (!countries.includes(jb.STATE)) {
            countries.push(jb.STATE);
        }
    }

    let countrySelect = document.getElementById("countrySearchInp");
    let countryOptions = countrySelect.getElementsByTagName("option");
    for (let i = 0; i < countryOptions.length; i++) {
        if (i >= countrySelect.getElementsByTagName("option").length);
        let option = countryOptions[i];
        if (!countries.includes(option.value)) {
            countrySelect.remove(i);
            i--;
        }
    }
}

function searchJbs() {
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
    document.getElementById("lastNameSearchInp").value = "";
    document.getElementById("countrySearchInp").value = "";
    document.getElementById("functionsSearchInp").value = "";
    searchJbs();
}

function addNewJbRow(butt) {
    if (butt.innerHTML == "Add person") {
        butt.innerHTML = "Cancel adding person";
    }
    else {
        butt.innerHTML = "Add person";
        newJbRow.remove();
        return;
    }

    let jbTable = document.getElementById("jbsAdmsTable");

    let countrySelInp = createElementFromHTML(countryCodes);
    countrySelInp.setAttribute("id", "addJbCountrySelInp");
    countrySelInp.setAttribute("class", "textBoxLight");

    let functionSelInp = createElementFromHTML(functionsCodes);
    functionSelInp.setAttribute("id", `addJbFuncSelInp`);

    newJbRow = insertRow(jbTable, 1, [
        {"text": countrySelInp.outerHTML},
        {"text": `<input type="text" id="addJbLastNameInp" class="textBoxLight">`},
        {"text": `<input type="text" id="addJbFirstNameInp" class="textBoxLight">`},
        {"text": functionSelInp.outerHTML},
        {"text": `<input type="text" id="addJbPassIdInp" class="textBoxLight">`},
        {"text": `<input type="date" id="addJbPassRelInp" class="textBoxLight">`},
        {"text": `<input type="date" id="addJbPassExpInp" class="textBoxLight">`},
        {"text": `<input type="date" id="addJbBirthdayInp" class="textBoxLight">`},
        {"text": `<select id="addJbGenderInp" class="textBoxLight"><option value="m" selected>Man</option><option value="w">Woman</option></select>`},
        {"text": `<input type="text" id="addJbIdInp" class="textBoxLight">`},
        {"text": `<button onclick="addNewJb()">Save</button>`}
    ]);
}

async function addNewJb() {
    let stateInp = document.getElementById("addJbCountrySelInp");
    let lastNameInp = document.getElementById("addJbLastNameInp");
    let firstNameInp = document.getElementById("addJbFirstNameInp");
    let funcSelInp = document.getElementById("addJbFuncSelInp");
    let passIdInp = document.getElementById("addJbPassIdInp");
    let passRelInp = document.getElementById("addJbPassRelInp");
    let passExpInp = document.getElementById("addJbPassExpInp");
    let birthdayInp = document.getElementById("addJbBirthdayInp");
    let genderInp = document.getElementById("addJbGenderInp");
    let jbInp = document.getElementById("addJbIdInp");

    if (stateInp.value == "") {
        showWrongAlert("Cannot be empty", "Country cannot be empty", alertTime);
        return;
    }
    if (lastNameInp.value == "") {
        showWrongAlert("Cannot be empty", "Last name cannot be empty", alertTime);
        return;
    }
    if (firstNameInp.value == "") {
        showWrongAlert("Cannot be empty", "First name cannot be empty", alertTime);
        return;
    }
    if (funcSelInp.value == "") {
        showWrongAlert("Cannot be empty", "Function cannot be empty", alertTime);
        return;
    }
    if (birthdayInp.value == "") {
        showWrongAlert("Cannot be empty", "Birthday cannot be empty", alertTime);
        return;
    }
    if (jbInp.value == "") {
        showWrongAlert("Cannot be empty", "JudoBase ID cannot be empty", alertTime);
        return;
    }

    let req = {
        "STATE": stateInp.value,
        "SUR_NAME": lastNameInp.value,
        "NAME": firstNameInp.value,
        "FUNCTION": (funcSelInp.value == "") ? "Others" : funcSelInp.value,
        "PASS_ID": passIdInp.value,
        "PASS_RELEASE": (passRelInp.value == "") ? null : passRelInp.value,
        "PASS_EXPIRATION": (passExpInp.value == "") ? null : passExpInp.value,
        "BIRTHDAY": birthdayInp.value,
        "GENDER": genderInp.value,
        "JB": jbInp.value
    };

    let response = await callEndpoint("POST", "/jb/create", req);
    if (response.ERROR == null) {
        showOkAlert("Created", "JB has been created", alertTime);
        document.getElementById("addPersonButt").innerHTML = "Add person";
        buildJbsTable();
    }
    else {
        showErrorAlert(response.ERROR, alertTime);
    }
}

function deleteJb(id, index) {
    showConfirm("Delete?", `Do you really want to delete<br>${localJbs[index].SUR_NAME} ${localJbs[index].NAME}?`,
        function(){reallyDeleteJb(id);}
    );
}

async function reallyDeleteJb(id) {
    let req = {
        "ID": id
    };

    let response = await callEndpoint("POST", "/jb/remove", req);
    if (response.ERROR == null) {
        showOkAlert("Deleted", "JB has been deleted", alertTime);
        buildJbsTable();
    }
    else {
        showErrorAlert(response.ERROR, alertTime);
    }
}