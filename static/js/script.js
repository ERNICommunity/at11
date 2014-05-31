/* global writeCookie, readCookie */

$(document).ready(function() {
    var container = $("#container");
    loadMenus(container);
    initialHide(container);
    container.masonry();
    
    $('#restaurantSelector').on('click', 'li', function(){
        var li = $(this);
        var restaurantId = li.data('restaurantId');
        var checkBox = li.children('i').first();
        
        var section;
        if(checkBox.hasClass('fa-check-square-o'))//checked
        {
            checkBox.removeClass('fa-check-square-o').addClass('fa-square-o');//uncheck
            section = $('section[data-restaurant-id=' + restaurantId + ']', container);
            window.hiddenRestaurants[restaurantId.toString()] = section;
            container.masonry('remove', section).masonry();
        }
        else//unchecked
        {
            checkBox.removeClass('fa-square-o').addClass('fa-check-square-o');//check
            section = window.hiddenRestaurants[restaurantId.toString()];
            delete window.hiddenRestaurants[restaurantId.toString()];
            container.append(section).masonry('appended', section).masonry();
        }
        
        var hiddenRestaurantsIds = [];
        $.each(window.hiddenRestaurants, function (key) {
            hiddenRestaurantsIds.push(key);
        });
        writeCookie('hiddenRestaurants', hiddenRestaurantsIds.join(','), 10);
    });
});

function loadMenus(container) {
    $("section", container).each(function () {
        var section = $(this);
        var restaurantId = section.data("restaurantId");
        $.ajax("/menu/" + restaurantId)
            .done(function (data) {
                var ul = $("<ul></ul>");
                if ($.isEmptyObject(data.menu))
                {
                    ul.append("<li class='error'><i>\uf071</i><span>Nepodarilo sa načítať menu, skús pozrieť priamo na stránke reštaurácie</span></li>");
                }
                else
                {
                    data.menu.forEach(function (item) {
                        var li = $("<li></li>");
                        if (item.isSoup)
                        {
                            li.addClass("soup");
                            li.append("<i>\uf1b1</i>");
                        }
                        else if (item.isError)
                        {
                            li.addClass("error");
                            li.append("<i>\uf071</i>");
                        }
                        else
                            li.append("<i>\uf0f5</i>");
                        li.append("<span>" + item.text + "</span>");
                        if (item.price)
                            li.append("<span class='price'>" + item.price + "</span>");
                        ul.append(li);
                    });
                }
                section.append(ul);
                section.append("<span class='timeago'><i class='fa fa-refresh'></i> " + data.timeago + "</span>");
            })
            .fail(function (jqXHR, textStatus) {
                section.append("<ul><li class='error'><i>\uf071</i><span>" + textStatus + "</span></li></ul>");
            })
            .always(function () {
                section.find(".fa-spin").remove();
                container.masonry();
            });
    });
}

function initialHide(container) {
    window.hiddenRestaurants = {};
    
    var hidden = readCookie("hiddenRestaurants");
    if(!hidden)
        return;
    hidden = hidden.split(",");
    
    $.each(hidden, function (index, value) {
        var section = $('section[data-restaurant-id=' + value + ']', container);
        if(section.length > 0)//found
        {
            window.hiddenRestaurants[value.toString()] = section;
            section.remove();
            var checkBox = $('#restaurantSelector li[data-restaurant-id=' + value + '] > i');
            checkBox.removeClass('fa-check-square-o').addClass('fa-square-o');//uncheck
        }
    });    
}

