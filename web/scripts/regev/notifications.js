
function changeNotification(index, newClass, comment) {
    let not = document.getElementById(`regTabC${index}`);
    not.className = "notification";
    not.classList.add(newClass);
    not.setAttribute("title", comment);

    let lbl = document.getElementById(`errorLabel${index}`);
    if (lbl != null) {
        clearTable(lbl);
        if (newClass == "notifErr") {
            lbl.innerHTML = `<img src="./images/warningIcon.png" class="needVisa"><br>` + comment;
        }
    }
}