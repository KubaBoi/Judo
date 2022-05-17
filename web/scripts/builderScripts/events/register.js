
function regEvShow() {
    var registerToEventDiv = document.getElementById("registerToEventDiv");
    registerToEventDiv.style.animationName = "comeRegisterToEvent";
    registerToEventDiv.style.animationFillMode = "forwards";
    registerToEventDiv.style.animationDuration = "0.5s";
}

function regEvClose() {
    var registerToEventDiv = document.getElementById("registerToEventDiv");
    registerToEventDiv.style.animationName = "closeRegisterToEvent";
    registerToEventDiv.style.animationFillMode = "forwards";
    registerToEventDiv.style.animationDuration = "0.5s";
}

async function registerToEventShow(eventId) {
    showLoader();

    var event = await getEventInfo(`/events/get?eventId=56`);//${eventId}`);
    

    hideLoader();
    regEvShow();
}

async function getEventInfo(url) {
    var response = await callEndpoint("GET", url);
    if (response.ERROR != null) {
        console.log(response.ERROR);
        showErrorAlert(response.ERROR);
    } else {
        return response;
    }
    return "ERROR :/";
}