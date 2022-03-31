newContent("clubssDiv");
debug = true;
var userAccountName;
var userName = getCookie("userName");
var password = getCookie("password");
if (userName && password) {
    login();
}