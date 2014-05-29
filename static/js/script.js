 $(document).ready(function() {
    var container = $("#container");
    loadRestaurants(container);
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
