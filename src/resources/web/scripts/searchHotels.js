var hotelSearchInp = document.getElementById("hotelSearchInp");
hotelSearchInp.addEventListener("keydown", function(e) {
    setTimeout(buildHotelTable, 100);
});