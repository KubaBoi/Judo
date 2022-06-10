
function changeNotification(index, newClass, comment) {
    let not = document.getElementById(`regTabC${index}`);
    if (not != null) {
        not.className = "notification";
        not.classList.add(newClass);
        not.setAttribute("title", comment);
    }

    let lbl = document.getElementById(`errorLabel${index}`);
    if (lbl != null) {
        clearTable(lbl);
        if (newClass == "notifErr") {
            lbl.innerHTML = `<img src="./images/warningIcon.png" class="needVisa"><br>` + comment;
        }
    }
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