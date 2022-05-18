function getHiddenTab() {
    var hiddenTab = document.getElementById("hiddenTab");
    hiddenTab.innerHTML = "";

    createElement("button", hiddenTab, "<b>X</b>",
    [
        {"name": "onclick", "value": "closeHiddenTab()"}
    ]);
    return hiddenTab;
}

function openHiddenTab() {
    var hiddenTab = document.getElementById("hiddenTab");
    hiddenTab.setAttribute("class", "openTab");
}

function closeHiddenTab() {
    var hiddenTab = document.getElementById("hiddenTab");
    hiddenTab.setAttribute("class", "closeTab");
}