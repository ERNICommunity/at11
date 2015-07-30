/* global writeCookie, readCookie, CurrentDay */

$(document).ready(function() {
    $('.navigation-info').remove();

    var container = $("#container");
    loadMenus(container);
    initialHide(container);
    container.masonry();

    $('#selectrestaurants').on('click', function(e) {
        e.stopPropagation();

        var $target = $(e.target);
        var checkbox;
        if($target.val() === '') {
            checkbox = $target.children('input').length > 0 ? $target.children('input') : $target.siblings('input');
            checkbox.prop('checked', !checkbox.prop('checked'));
        }
        else
            checkbox = $target;

        var id = checkbox.val();
        var section;
        if(checkbox.prop('checked'))//show
        {
            section = window.hiddenRestaurants[id.toString()];
            delete window.hiddenRestaurants[id.toString()];
            container.append(section).masonry('appended', section).masonry();
        }
        else//hide
        {
            section = $('section[data-restaurant-id=' + id + ']', container);
            window.hiddenRestaurants[id.toString()] = section;
            container.masonry('remove', section).masonry();
        }

        var unChecked = [];
        $('input[type="checkbox"]', this).each(function() {
            if(!$(this).prop('checked'))
                unChecked.push($(this).val());
        });
        writeCookie('hiddenRestaurants', unChecked.join(','), 10 * 365);
    });
});

function loadMenus(container) {
    $("section", container).each(function() {
        var section = $(this);
        var restaurantId = section.data("restaurantId");
        $.ajax("/menu/" + restaurantId + "/" + CurrentDay())
            .done(function(data) {
                var ul = $("<ul></ul>");
                if($.isEmptyObject(data.menu)) {
                    ul.append("<li class='error'><i>\uf071</i><span>Nepodarilo sa načítať menu, skús pozrieť priamo na stránke reštaurácie</span></li>");
                }
                else {
                    data.menu.forEach(function(item) {
                        var li = $("<li></li>");
                        if(item.isSoup) {
                            li.addClass("soup");
                            li.append("<i>\uf1b1</i>");
                        }
                        else if(item.isError) {
                            li.addClass("error");
                            li.append("<i>\uf071</i>");
                        }
                        else
                            li.append("<i>\uf0f5</i>");
                        li.append("<span>" + item.text + "</span>");
                        if(item.price)
                            li.append("<span class='price'>" + item.price + "</span>");
                        ul.append(li);
                    });
                }
                section.append(ul);
                if(data.timeago !== undefined) { section.append("<span class='timeago'><i class='fa fa-refresh'></i> " + data.timeago + "</span>"); }
            })
            .fail(function(jqXHR, textStatus) {
                section.append("<ul><li class='error'><i>\uf071</i><span>" + textStatus + "</span></li></ul>");
            })
            .always(function() {
                section.find(".fa-spinner").remove();
                container.masonry();
            });
    });
}

function initialHide(cont) {
    window.hiddenRestaurants = {};

    var hidden = readCookie("hiddenRestaurants");
    if(typeof hidden === "undefined")
        return;

    hidden = hidden.split(",");

    $("section", cont).each(function() {
        var section = $(this);
        var restaurantId = section.data("restaurantId");
        if(hidden.indexOf(restaurantId.toString()) > -1)//hide section
        {
            window.hiddenRestaurants[restaurantId.toString()] = section;
            section.remove();
            $('input[type=checkbox][value=' + restaurantId + ']', '#selectrestaurants').prop('checked', false);
        }
    });
}