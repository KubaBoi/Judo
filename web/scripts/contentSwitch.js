function newContent(id) {
    setTimeout(function(){switchContent(id)}, switchTime);
}

function switchContent(id) {
    var newCont = document.getElementById(id);
    if (newCont == activeContent) return;

    newCont.style.animationName = "newContent";
    newCont.style.animationFillMode = "forwards";
    newCont.style.animationDuration = "0.5s";
    newCont.style.animationDirection = "both";

    if (activeContent) {
        activeContent.style.animationName = "oldContent";
        activeContent.style.animationFillMode = "forwards";
        activeContent.style.animationDuration = "0.5s";
        activeContent.style.animationDirection = "both";

        if (newCont.id != "mainDiv") {
            var th = document.getElementById(id + "Th");
            th.classList.add("activeTh");
        }
        
        if (activeContent.id != "mainDiv") {
            var thActive = document.getElementById(activeContent.id + "Th");
            thActive.classList.remove("activeTh");
        }
    }

    activeContent = newCont;
}