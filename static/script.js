function writeCookie(cookieName, cookieValue, nDays) {
    var today = new Date();
    var expire = new Date();
    if(!nDays) { nDays = 1; }
    expire.setTime(today.getTime() + 3600 * 1000 * 24 * nDays);
    document.cookie = cookieName + "=" + escape(cookieValue) + ";expires=" + expire.toUTCString() + ";path=/";
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
    var dateCompound = getDateCompound();

    $('#date').text(dateCompound.description);
    var date = dateCompound.date;
    $("article", container).each(function() {
        var article = $(this);
        var restaurantId = article.data("restaurantId");
        var link = $("a", article).prop('href');

        var errElem = "<li class='error'><span>Nepodarilo sa načítať menu, skús pozrieť priamo na <a href='"+link+"' target='_blank'>stránke reštaurácie</a></span></li>";
        var listElem = $("<ul></ul>");
        var refreshElem = null;
        $.ajax("/menu/" + restaurantId + "?date=" + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate())
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
                    article.find(".loader").remove();
                    article.append(listElem);
                    if(refreshElem){
                        article.append(refreshElem);
                    }
                    container.masonry();
                });
    });
}

function initialHide(cont) {
    window.hiddenRestaurants = {};
    var hidden = readCookie("hiddenRestaurants");
    if(typeof hidden === "undefined") {
        return;
    }
    hidden = hidden.split(",");

    $("article", cont).each(function() {
        var article = $(this);
        var restaurantId = article.data("restaurantId");
        if(hidden.indexOf(restaurantId.toString()) > -1) // hide
        {
            window.hiddenRestaurants[restaurantId.toString()] = article;
            article.remove();
            $('input[type=checkbox][value=' + restaurantId + ']', '#selectrestaurants').prop('checked', false);
        }
    });
}

function getDateCompound() {
    var date = new Date();
    var desc = "dnes";
    if(date.getHours() >= 15) {
        date.setDate(date.getDate() + 1);
        desc = "zajtra";
    }
    return { date: date, description: desc + " " + date.toLocaleDateString('sk') };
}

function startClock() {
     // CSS3 Analog Clock- by JavaScript Kit (www.javascriptkit.com)
     var $hands = $('#liveclock div.hand')
     window.requestAnimationFrame = window.requestAnimationFrame
                                    || window.mozRequestAnimationFrame
                                    || window.webkitRequestAnimationFrame
                                    || window.msRequestAnimationFrame
                                    || function(f){setTimeout(f, 60)}
     function updateclock(){
         var curdate = new Date()
         var hour_as_degree = ( curdate.getHours() + curdate.getMinutes()/60 ) / 12 * 360
         var minute_as_degree = curdate.getMinutes() / 60 * 360
         var second_as_degree = ( curdate.getSeconds() + curdate.getMilliseconds()/1000 ) /60 * 360
         $hands.filter('.hour').css({transform: 'rotate(' + hour_as_degree + 'deg)' })
         $hands.filter('.minute').css({transform: 'rotate(' + minute_as_degree + 'deg)' })
         $hands.filter('.second').css({transform: 'rotate(' + second_as_degree + 'deg)' })
         requestAnimationFrame(updateclock)
     }
     requestAnimationFrame(updateclock)
}

startClock()
var container = $("#container");
loadMenus(container);
initialHide(container);
container.masonry({
    fitWidth: true
});

$('#selectrestaurants').on('click', function(e) {
    e.stopPropagation();

    var $target = $(e.target);
    var checkbox;
    if($target.val() === 0) {
        checkbox = $target.children('input').length > 0 ? $target.children('input') : $target.siblings('input');
        checkbox.prop('checked', !checkbox.prop('checked'));
    }
    else {
        checkbox = $target;
    }

    var id = checkbox.val();
    var article;
    if(checkbox.prop('checked'))//show
    {
        article = window.hiddenRestaurants[id.toString()];
        delete window.hiddenRestaurants[id.toString()];
        container.append(article).masonry('appended', article).masonry();
    }
    else//hide
    {
        article = $('article[data-restaurant-id=' + id + ']', container);
        window.hiddenRestaurants[id.toString()] = article;
        container.masonry('remove', article).masonry();
    }

    var unChecked = [];
    $('input[type="checkbox"]', this).each(function() {
        if(!$(this).prop('checked')) {
            unChecked.push($(this).val());
        }
    });
    writeCookie('hiddenRestaurants', unChecked.join(','), 10 * 365);
});
