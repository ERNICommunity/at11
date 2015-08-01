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
    var errElem = "<li class='error'><i>\uf071</i><span>Nepodarilo sa načítať menu, skús pozrieť priamo na stránke reštaurácie</span></li>";
    var date = getDate();
    
    $('#date').text(date.toLocaleDateString());
    $("section", container).each(function() {
        var section = $(this);
        var restaurantId = section.data("restaurantId");
        var ul = $("<ul></ul>");
        $.ajax("/menu/" + restaurantId + "/" + date.toISOString().split('T')[0])
                .done(function(data) {
                    if (!data) {
                        ul.append(errElem);
                    }
                    else {
                        data.menu.forEach(function(item) {
                            var li = $("<li></li>");
                            if (item.isSoup) {
                                li.addClass("soup");
                                li.append("<i>\uf1b1</i>");
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
                        section.append("<span class='timeago'><i class='fa fa-refresh'></i> " + data.timeago + "</span>");
                    }
                })
                .fail(function() {
                    ul.append(errElem);
                })
                .always(function() {
                    section.find(".fa-spinner").remove();
                    section.append(ul);
                    container.masonry();
                });
    });
}

function getDate() {
    var date = new Date();
    if(date.getHours() > 15) {
        date.setDate(date.getDate() + 1);
    }
    return date;
}
