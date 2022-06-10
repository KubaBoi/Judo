
function changeNotification(index, newClass, comment) {
    let not = document.getElementById(`regTabC${index}`);
    not.className = "notification";
    not.classList.add(newClass);
    not.setAttribute("title", comment);
}