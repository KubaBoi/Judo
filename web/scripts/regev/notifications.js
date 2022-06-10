
function changeNotification(index, newClass) {
    let not = document.getElementById(`regTabC${index}`);
    not.className = "notification";
    not.classList.add(newClass);
}