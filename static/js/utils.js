window.writeCookie = function(cookieName, cookieValue, nDays) {
    var today = new Date();
    var expire = new Date();
    if(!nDays) { nDays = 1; }
    expire.setTime(today.getTime() + 3600 * 1000 * 24 * nDays);
    document.cookie = cookieName + "=" + escape(cookieValue) + ";expires=" + expire.toUTCString() + ";path=/";
};

window.readCookie = function(name) {
    var cookies = document.cookie.split(";");
    for(var i = 0; i < cookies.length; i++) {
        var nameValue = cookies[i].split("=");
        if(nameValue[0].trim() === name) {
            return unescape(nameValue[1].trim());
        }
    }
};

window.loadMenus = function(container) {
    var dateCompound = window.getDateCompound();

    $('#date').text(dateCompound.description);
    var date = dateCompound.date;
    $("section", container).each(function() {
        var section = $(this);
        var restaurantId = section.data("restaurantId");
        var link = $("a", section).prop('href');

        var errElem = "<li class='error'><span>Nepodarilo sa načítať menu, skús pozrieť priamo na <a href='"+link+"' target='_blank'>stránke reštaurácie</a></span></li>";
        var listElem = $("<ul></ul>");
        var refreshElem = null;
        $.ajax("/menu/" + restaurantId + "/" + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate())
                .done(function(data) {
                    if (data.menu.length === 0) {
                        listElem.append(errElem);
                    }
                    else {
                        data.menu.forEach(function(item) {
                            var li = $("<li></li>");
                            if (item.isSoup) {
                                li.addClass("soup");
                            }
                            li.append("<span>" + item.text + "</span>");
                            if (item.price) {
                                li.append("<span class='price'>" + item.price.toFixed(2) + "€</span>");
                            }
                            listElem.append(li);
                        });
                        refreshElem = "<span class='timeago'>" + data.timeago + "</span>";
                    }
                })
                .fail(function() {
                    listElem.append(errElem);
                })
                .always(function() {
                    section.find(".loader").remove();
                    section.append(listElem);
                    if(refreshElem){
                        section.append(refreshElem);
                    }
                    container.masonry();
                });
    });
};

window.getDateCompound = function() {
    var date = new Date();
    var desc = "dnes";
    if(date.getHours() >= 15) {
        date.setDate(date.getDate() + 1);
        desc = "zajtra";
    }
    return { date: date, description: desc + " " + date.toLocaleDateString() };
};
