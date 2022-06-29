/*
.notifPend
.notifErr
.notifDone
*/
function changeNotification(id, newClass, comment=null, check=true) {
    let not = document.getElementById(id);
    if (not != null) {
        not.className = "notification";
        not.classList.add(newClass);
        if (comment != null) not.setAttribute("title", comment);
    }

    if (comment != null) showNotifError(id, comment, newClass);

    if (check == true) setTimeout(calculateBill, 1000);
}

function getNotifStatus(id) {
    let not = document.getElementById(id);
    if (not != null) {
        if (not.classList.contains("notifPend")) return 0;
        else if (not.classList.contains("notifDone")) return 1;
        else if (not.classList.contains("notifErr")) return 2; 
    }
    return -1;
}

function getNotifTitle(id) {
    let not = document.getElementById(id);
    if (not != null) {
        return not.getAttribute("title");
    }
    return null;
}

function showNotifError(id, comment=null, newClass="notifErr") {
    if (comment == null) {
        comment = getNotifTitle(id);
    }

    let lbl = document.getElementById(`errorLabel${id}`);
    if (lbl != null) {
        clearTable(lbl);
        if (newClass == "notifErr") {
            lbl.innerHTML = `<img src="./images/warningIcon.png" class="needVisa"><br>` + comment;
        }
    }
}