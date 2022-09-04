var targetObj = {};
var targetProxy = new Proxy(targetObj, {
    set: function (target, key, value) {
        target[key] = value;
        if (key == "adminAccess") {
            adminAccChangeJbsBuilder();
        }
        return true;
    }
});

function adminAccChangeJbsBuilder() {
    if (activeContent == null) return;
    if (activeContent.id != "jbAdministrationDiv") return;

    searchJbs();
}