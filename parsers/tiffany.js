var zomato = require('./zomato');

module.exports.parse = function(html, date, callback) {
    zomato.parse(html, date, function(menuItems) {
        var soups = menuItems[0].text.replace(/^\s*[Pp]oli?evk[ay]\s*:\s*-\s*/, '').replace(/\s*\(0[\.,]25\)\s*$/, '').split(',');
        menuItems.shift();
        for(var i = 0; i < soups.length; i++) {
          menuItems.unshift({ isSoup: true, text: soups[i], price: NaN });
        }
        menuItems[menuItems.length - 1].isSoup = false; // last item is misidentified as soup
        callback(menuItems);
    });
};
