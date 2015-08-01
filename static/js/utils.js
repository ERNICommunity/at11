/* exported writeCookie, readCookie, loadMenus */

function writeCookie(cookieName, cookieValue, nDays) {
    var today = new Date();
    var expire = new Date();
    if(!nDays) { nDays = 1; }
    expire.setTime(today.getTime() + 3600 * 1000 * 24 * nDays);
    document.cookie = cookieName + "=" + escape(cookieValue) + ";expires=" + expire.toGMTString() + ";path=/";
}

function readCookie(name) {
    var cookies = document.cookie.split(";");
    for(var i = 0; i < cookies.length; i++) {
        var nameValue = cookies[i].split("=");
        if(nameValue[0].trim() === name) {
            return unescape(nameValue[1].trim());
        }
    }
}

function loadMenus(container) {
    $("section", container).each(function() {
        var section = $(this);
        var restaurantId = section.data("restaurantId");
        $.ajax("/menu/" + restaurantId + "/" + getCurrentDay())
                .done(function(data) {
                    var ul = $("<ul></ul>");
                    if ($.isEmptyObject(data.menu)) {
                        ul.append("<li class='error'><i>\uf071</i><span>Nepodarilo sa načítať menu, skús pozrieť priamo na stránke reštaurácie</span></li>");
                    }
                    else {
                        data.menu.forEach(function(item) {
                            var li = $("<li></li>");
                            if (item.isSoup) {
                                li.addClass("soup");
                                li.append("<i>\uf1b1</i>");
                            }
                            else if (item.isError) {
                                li.addClass("error");
                                li.append("<i>\uf071</i>");
                            }
                            else {
                                li.append("<i>\uf0f5</i>");
                            }
                            li.append("<span>" + item.text + "</span>");
                            if (item.price) {
                                li.append("<span class='price'>" + item.price + "</span>");
                            }
                            ul.append(li);
                        });
                    }
                    section.append(ul);
                    if (data.timeago !== undefined) {
                        section.append("<span class='timeago'><i class='fa fa-refresh'></i> " + data.timeago + "</span>");
                    }
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

function getCurrentDay() {
    var realDay = new Date().getDay();
    if(new Date().getHours() > 15) { realDay++; }
    if(realDay > 5 || realDay < 1) {
        realDay = 1;
    }
    return realDay;
}