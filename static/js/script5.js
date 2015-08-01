/* global loadMenus */

$(document).ready(function() {
    var container = $("#container");
    loadMenus(container);
    
    container.carousel({
        interval: 4000,
        pause: false
    });
    
    $(document).bind('keyup', function(e) {
        if (e.which === 39) {
            container.carousel('next');
        } else if (e.which === 37) {
            container.carousel('prev');
        }
    });
});
