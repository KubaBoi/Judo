
function changeNotification(index, newClass, comment=null) {
    let not = document.getElementById(`regTabC${index}`);
    if (not != null) {
        not.className = "notification";
        not.classList.add(newClass);
        if (comment != null) not.setAttribute("title", comment);
    }

    if (comment != null) showNotifError(index, comment, newClass);
}

function getNotifStatus(index) {
    let not = document.getElementById(`regTabC${index}`);
    if (not != null) {
        if (not.classList.contains("notifPend")) return 0;
        else if (not.classList.contains("notifDone")) return 1;
        else if (not.classList.contains("notifErr")) return 2; 
    }
    return -1;
}

function getNotifTitle(index) {
    let not = document.getElementById(`regTabC${index}`);
    if (not != null) {
        return not.getAttribute("title");
    }
    return null;
}

function showNotifError(index, comment=null, newClass="notifErr") {
    if (comment == null) {
        comment = getNotifTitle(index);
    }

    let lbl = document.getElementById(`errorLabel${index}`);
    if (lbl != null) {
        clearTable(lbl);
        if (newClass == "notifErr") {
            lbl.innerHTML = `<img src="./images/warningIcon.png" class="needVisa"><br>` + comment;
        }
    }
}