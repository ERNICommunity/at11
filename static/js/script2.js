$(document).ready(function() {    
    $(".tab-pane").each(function(){
        var section = $(this);
        var restaurantId = section.data("restaurantId");
        $.ajax("/menu/" + restaurantId)
            .done(function(data) {
                var ul = $("<ul class=\"food\"></ul>");
                if($.isEmptyObject(data.menu))
                {
                    ul.append("<li class=\"bg-danger error\"><p class=\"text-danger\">Nepodarilo sa načítať menu, skús pozrieť priamo na stránke reštaurácie</span></li>");
                }
                else
                {
                    data.menu.forEach(function(item){
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
            .always(function(){
                section.find(".fa-spin").remove();
            });
        });
});
