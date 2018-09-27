var cheerio = require('cheerio');
require('./parserUtil');

module.exports.parse = function(html, date, callback) {
    var $ = cheerio.load(html);
    var dayMenu = [];
    
    var dateStr = date.format("DD.MM.YYYY");

    var dayTitle = $('.day-title').filter(function(){
        var title = $(this).text();
        return title.indexOf(dateStr) > -1;
    }).parent();

    var soups = parseSoups();
    var meals = parseMeals();

    soups.forEach((soup) => {
        dayMenu.push({ isSoup: true, text: soup.text, price: soup.price });
    });
    meals.forEach((meal) => {
        dayMenu.push({ isSoup: false, text: meal.text, price: meal.price });
    });

    callback(dayMenu);

    function parseSoups(){
        var soupsElem = dayTitle.next();
        var soups = soupsElem.text()
            .replace("Polievka", "")
            .replace(/\([0-9,]+\)/g, "")
            .split("/")
            .map((soup) => {
                soup = soup.normalizeWhitespace();
                return { text: soup, price: NaN };
            });

        return soups;
    }

    function parseMeals(){
        var meals = [];
        var defaultMenuPrice = dayTitle.next().next().text().replace(/,/, '.').trim();
        var elem = dayTitle.next().next();

        for(var i = 0; i < 6; i++){
            var mealElem = elem.next();
            var meal = mealElem.text()
                .replace(/MENU [1-9]/, "")
                .normalizeWhitespace();

            var priceElem = mealElem.next();
            var price;

            if(i < 5) {
                if (/\S/.test(priceElem.text())) {
                    price = priceElem.text().replace(/,/, '.').trim();
                } else {
                    price = defaultMenuPrice;
                }
            } else {
                price = NaN;
            }
            
            meals.push({ text: meal, price: parseFloat(price) });
            elem = mealElem.next();
        }

        return meals;
    }
};
