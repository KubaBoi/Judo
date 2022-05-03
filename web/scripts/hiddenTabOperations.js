function openHiddenTab() {
    var hiddenTab = document.getElementById("hiddenTab");
    hiddenTab.innerHTML = "";

    createElement("button", hiddenTab, "<b>X</b>",
    [
        {"name": "onclick", "value": "closeHiddenTab()"}
    ]);
    hiddenTab.setAttribute("class", "openTab");
    return hiddenTab;
}

function closeHiddenTab() {
    var hiddenTab = document.getElementById("hiddenTab");
    hiddenTab.setAttribute("class", "closeTab");
}