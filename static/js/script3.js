$(document).ready(function () {
    $('.navigation-info').remove();
    
    var container = $("#container");    
    loadRestaurants(container);
    initialHide(container);
    container.masonry();
});

function loadRestaurants(container) {
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

function initialHide(cont)
{
    window.hiddenRestaurants = {};
    
    var hidden = readCookie("hiddenRestaurants");
    if(typeof hidden === "undefined")
        return;
    
    hidden = hidden.split(",");
    
    $("section", cont).each(function(){
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

function readCookie(name)
{
    var cookies = document.cookie.split(";");
    for(var i = 0; i < cookies.length; i++)
    {
        var nameValue = cookies[i].split("=");
        if (nameValue[0].trim() === name)
            return unescape(nameValue[1].trim());
    }
}