
function regIvShow() {
    var registerToEventDiv = document.getElementById("registeredToEventDiv");
    registerToEventDiv.style.animationName = "comeRegisterToEvent";
    registerToEventDiv.style.animationFillMode = "forwards";
    registerToEventDiv.style.animationDuration = "0.5s";
}

function regIvClose() {
    var registerToEventDiv = document.getElementById("registeredToEventDiv");
    registerToEventDiv.style.animationName = "closeRegisterToEvent";
    registerToEventDiv.style.animationFillMode = "forwards";
    registerToEventDiv.style.animationDuration = "0.5s";
}

//second part
async function registeredToEventShow(eventId) {
    showLoader();

    chooseRegTab(document.getElementById("regTabB0"));

    var event = await getEventInfo(`/events/get?eventId=${eventId}`);
    event = event.EVENT;
    var dv = document.getElementById("regIvInfoDiv");
    clearTable(dv);

    var tbl = createElement("table", dv);
    setDataToInfoTable(tbl, event);

    await buildRegIvTables(event);

    hideLoader();
    regIvShow();

    let hideLabel = document.getElementById("hideLabel");
    if (hideLabel == null) {
        let div = document.getElementById("registeredToEventDiv");
        createElement("button", div, "<b><<</b>", [
            {"name": "class", "value": "hideLabel"},
            {"name": "id", "value": "hideLabel"},
            {"name": "onclick", "value": "hideInfoDiv()"}
        ]);
    }
}