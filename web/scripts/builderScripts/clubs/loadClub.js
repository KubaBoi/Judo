async function loadClubs() {
    let resp = await callEndpoint("GET", `/clubs/getByUser?userId=${loggedUser.ID}`);
    if (resp.ERROR == null) {
        usersClubs = resp.CLUBS;

        if (usersClubs.length > 0) {
            if (loggedClub == null) {
                loggedClub = usersClubs[0];
            }

            let clubSelect = document.getElementById("clubSelectInp");
            clearTable(clubSelect);
            clubSelect.addEventListener("change", onChangeClubSelect);

            for (let i = 0; i < usersClubs.length; i++) {
                let club = usersClubs[i];

                let attrs = [
                    {"name": "value", "value": i},
                    {"name": "title", "value": `${club.ADDRESS} ${club.STATE}`}
                ];

                if (club.ID == loggedClub.ID) {
                    loggedClub = club; // reload from backend
                    attrs.push({"name": "selected", "value": ""});
                }

                createElement("option", clubSelect, club.NAME, attrs);
            }
        }
        else {
            loggedClub = null;
        }
    }
    else {
        showErrorAlert(resp.ERROR, alertTime);
    }
}

function onChangeClubSelect() {
    let clubSelect = document.getElementById("clubSelectInp");
    loggedClub = usersClubs[clubSelect.value];
    buildEventTable(false);
}