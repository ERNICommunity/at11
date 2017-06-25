/* global writeCookie, readCookie, loadMenus */

$(document).ready(function() {
    var container = $("#container");
    loadMenus(container);
    initialHide(container);
    container.masonry();

    $("#restaurantSelector").on("click", "li", function() {
        var li = $(this);
        var restaurantId = li.data("restaurantId");
        var checkBox = li.children("i").first();

        var section;
        if (checkBox.hasClass("fa-check-square-o")) {
            //checked
            checkBox.removeClass("fa-check-square-o").addClass("fa-square-o"); //uncheck
            section = $("section[data-restaurant-id=" + restaurantId + "]", container);
            window.hiddenRestaurants[restaurantId.toString()] = section;
            container.masonry("remove", section).masonry();
        } else {
            //unchecked
            checkBox.removeClass("fa-square-o").addClass("fa-check-square-o"); //check
            section = window.hiddenRestaurants[restaurantId.toString()];
            delete window.hiddenRestaurants[restaurantId.toString()];
            container.append(section).masonry("appended", section).masonry();
        }

        var hiddenRestaurantsIds = [];
        $.each(window.hiddenRestaurants, function(key) {
            hiddenRestaurantsIds.push(key);
        });
        writeCookie("hiddenRestaurants", hiddenRestaurantsIds.join(","), 10 * 365);
    });

    $(".hover").on("touchstart", function() {
        $(this).toggleClass("hover-effect");
    });
});

function initialHide(container) {
    window.hiddenRestaurants = {};

    var hidden = readCookie("hiddenRestaurants");
    if (!hidden) {
        return;
    }
    hidden = hidden.split(",");

    $.each(hidden, function(index, value) {
        var section = $("section[data-restaurant-id=" + value + "]", container);
        if (section.length > 0) {
            //found
            window.hiddenRestaurants[value.toString()] = section;
            section.remove();
            var checkBox = $("#restaurantSelector li[data-restaurant-id=" + value + "] > i");
            checkBox.removeClass("fa-check-square-o").addClass("fa-square-o"); //uncheck
        }
    });
}
