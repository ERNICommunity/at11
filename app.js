var express = require('express');
var hbs = require('hbs');
var moment = require("moment-timezone");

//our modules
var config = require('./config');
var menuFetcher = require('./menuFetcher');
var parserUtil = require('./parsers/parserUtil');

console.log("Initializing...");
var actions = {};
function createAction(url, parseCallback) {
    return function(fetchedCallback) {
        menuFetcher.fetchMenu(url, parseCallback, fetchedCallback);
    };
}
for (var i = 0; i < config.restaurants.length; i++)
{
    console.log(config.restaurants[i]);
    try
    {
        var parserModule = require("./parsers/" + config.restaurants[i].module);
        if (typeof parserModule.parse !== "function")
            throw "Module is missing parse method";
        if (parserModule.parse.length !== 2)
            throw "Module parse(..) method should have 2 parameters (html, callback)";
        var id = config.restaurants[i].id;
        if (typeof actions[id] !== "undefined")
            throw "Non unique id '" + id + "' provided";
        var url = config.restaurants[i].url;
        actions[id] = createAction(url, parserModule.parse);
    }
    catch (e)
    {
        console.log(e);
    }
}

if (Object.keys(actions).length === 0)
{
    console.log("Initialization failed, exiting");
    process.exit(1);
}
console.log("Initialization successful (" + Object.keys(actions).length + " of " + config.restaurants.length + ")");

console.log("Registering partials...");
hbs.registerPartials(__dirname + '/views/partials');
console.log("Done");

console.log("Global setup...");
moment.locale('sk');
function populateDates(){
    global.dates = [];
    for (var i = 1; i < 6; i++)
    {
        global.dates.push(moment().startOf('week').day(i));
    }
}
populateDates();
setInterval(populateDates, config.globalTickInterval); //periodically refresh dates
console.log("Done");

console.log("Express setup...");
var app = express();
app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.static('static'));
app.get('/:theme?', function(req, res) {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.setHeader('Content-Language', 'sk');
    var dateStr = moment().tz("Europe/Bratislava").format("D. M. YYYY");
    var theme = parserUtil.parseTheme(req);

    res.setHeader("Set-Cookie", ["theme=" + theme]);
    res.render(config.themes[theme].template, { date: dateStr, restaurants: config.restaurants, themes: config.themes });
});
app.get('/menu/:id/:day', function(req, res) {
    if (typeof actions[req.params.id] === "undefined")
    {
        res.statusCode = 404;
        res.send('No menu found');
    }
    else
    {
        var day = req.params.day || moment().day();
        day = moment().day(day).format("dddd");
        actions[req.params.id](function(weekMenu) {
            var dayMenu = weekMenu.filter(function(x) { if (x.day == day) return true; })[0];
            if (dayMenu === undefined)
            {
                res.json({});
            }
            else
            {
                res.json({ menu: dayMenu.menu, timeago: moment(weekMenu.cacheTime).fromNow() });
            }
        });
    }
});
console.log("Done");

app.listen(config.port);
console.log('Listening on port ' + config.port + '...');