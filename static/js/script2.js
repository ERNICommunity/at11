/* global writeCookie, readCookie */

(function($) {
    $.fn.hasScrollBar = function() {
        return this.get(0).scrollHeight > this.get(0).clientHeight;
    };
})(jQuery);

$(document).ready(function() {
    initialize();
    loadMenus();
});

function loadMenus() {
    $(".tab-pane").each(function() {
        var section = $(this);
        var restaurantId = section.data("restaurantId");
        $.ajax("/menu/" + restaurantId + "/" + CurrentDay())
            .done(function(data) {
                var ul = $("<ul class=\"food\"></ul>");
                if($.isEmptyObject(data.menu)) {
                    ul.append("<li class=\"bg-danger error\"><p class=\"text-danger\">Nepodarilo sa načítať menu, skús pozrieť priamo na stránke reštaurácie</span></li>");
                }
                else {
                    data.menu.forEach(function(item) {
                        var li = $("<li></li>");
                        if(item.isSoup)
                            li.addClass("soup");
                        if(item.isError)
                            li.addClass("bg-danger error text-danger");
                        li.append(item.text);
                        li.append("<div style=\"float: right; display: inline-block;\">" + item.price + "</div>");
                        ul.append(li);
                    });
                }
                section.append(ul);
                section.append("<span class='timeago'><i class='fa fa-refresh'></i> " + data.timeago + "</span>");
            })
            .fail(function(jqXHR, textStatus) {
                section.append("<ul><li class=\"bg-danger error\"><p class=\"text-danger\">" + textStatus + "</li></ul>");
            })
            .always(function() {
                section.find(".fa-spin").remove();
            });
    });
}

function initialize() {
    selectRestaurant(readCookie("restaurant") || 1);

    if(!$('html').hasScrollBar()) {
        $('#padding').addClass('hidden');
    }

    $(document).keyup(function(e) {
        e.preventDefault();

        if(e.keyCode === 38 || e.keyCode === 40)//UP or DOWN
        {
            var selectedRestaurant = parseInt(findSelectedRestaurantId());
            var restaurantCount = $('#navigationBar li').length + 1;

            unSelectRestaurant(selectedRestaurant);

            if(e.keyCode === 38) { //UP arrow
                selectedRestaurant = (selectedRestaurant - 1 + restaurantCount) % restaurantCount;
                if(selectedRestaurant === 0) selectedRestaurant = restaurantCount - 1;
            }
            if(e.keyCode === 40) { //DOWN arrow
                selectedRestaurant = (selectedRestaurant + 1) % restaurantCount;
                if(selectedRestaurant === 0) selectedRestaurant = 1;
            }

            selectRestaurant(selectedRestaurant);
        }

        if(e.keyCode === 13) { //ENTER
            window.open($("li.active > a").data("url"), '_blank');
        }

    });

    $('a[data-toggle="pill"]').on('shown.bs.tab', function() {
        writeCookie("restaurant", $(this).attr("href").slice("#restaurant".length), 10 * 365);
    });
    $('a[data-toggle="pill"]').parent().on('click', function() {
        if($(this).hasClass("active")) {
            window.open($("li.active > a").data("url"), '_blank');
        }
    });
    $("#select-restaurants").remove();
}

function selectRestaurant(id) {
    $('#navigationBar li a[href="\\#restaurant' + id + '"]').parent().addClass('active');
    $('#restaurant' + id).addClass('active');
    writeCookie("restaurant", id, 365);
}

function unSelectRestaurant(id) {
    $('#navigationBar li a[href="\\#restaurant' + id + '"]').parent().removeClass('active');
    $('#restaurant' + id).removeClass('active');
}

function findSelectedRestaurantId() {
    var activeRestaurant = $('#navigationBar .active').children().get(0);
    return $(activeRestaurant).attr('href').slice("#restaurant".length);
}
