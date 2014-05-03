$(document).ready(function() {
    var container = $("#container");
    container.masonry();
    
    $("section", container).each(function(){
        var section = $(this);
        var restaurantId = section.data("restaurantId");
        $.ajax("/menu/" + restaurantId)
            .done(function(data, textStatus, jqXHR) {
                var ul = $("<ul></ul>");
                if($.isEmptyObject(data.menu))
                {
                    ul.append("<li class=\"error\"><span>Nepodarilo sa načítať menu, skús pozrieť priamo na stránke reštaurácie</span></li>");
                }
                else
                {
                    data.menu.forEach(function(item){
                        var li = $("<li></li>");
                        if(item.isSoup)
                            li.addClass("soup");
                        if(item.isError)
                            li.addClass("error");
                        li.append("<span>" + item.text + "</span>");
                        li.append("<span class=\"price\">" + item.price + "</span>");
                        ul.append(li);
                    });
                }
                section.append(ul);
                section.append("<i>" + data.timeago + "</i>");
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                section.append("<ul><li class=\"error\"><span>" + textStatus + "</span></li></ul>");
            })
            .always(function(){
                section.find(".fa-spin").remove();
                container.masonry();
            });
        });
});
