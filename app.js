var express = require('express');
var hbs = require('hbs');
var moment = require("moment-timezone");
var fs = require('fs');

//our modules
var config = require('./config');
var menuFetcher = require('./menuFetcher');
var parserUtil = require('./parsers/parserUtil');
var themes = require('./themes')

console.log("Initializing...");
var actions = {};
for (var i = 0; i < config.restaurants.length; i++)
{
    console.log(config.restaurants[i]);
    try
    {
        var module = require("./parsers/" + config.restaurants[i].module);
        if (typeof module.parse !== "function")
            throw "Module is missing parse method";
        if (module.parse.length !== 2)
            throw "Module parse(..) method should have 2 parameters (html, callback)";
        var id = config.restaurants[i].id;
        if (typeof actions[id] !== "undefined")
            throw "Non unique id '" + id + "' provided";
        var url = config.restaurants[i].url;
        var action = (function(url, parseCallback) {
            return function(fetchedCallback) {
                menuFetcher.fetchMenu(url, parseCallback, fetchedCallback);
            };
        })(url, module.parse);
        actions[id] = action;
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
var template = fs.readFileSync(__dirname + '/views/partials/header.html', { encoding: "utf-8" });
hbs.registerPartial("header", template);
template = fs.readFileSync(__dirname + '/views/partials/footer.html', { encoding: "utf-8" });
hbs.registerPartial("footer", template);
console.log("Done");

console.log("Global setup...");
moment.lang('sk');
global.todaysDate = moment().tz("Europe/Bratislava");
setInterval(function() {//periodically refresh global time
    global.todaysDate = moment().tz("Europe/Bratislava");
}, config.globalTickInterval);
console.log("Done");

console.log("Express setup...");
var app = express();
app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.static('static'));
app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.setHeader('Content-Language', 'sk');
    var dateStr = global.todaysDate.format("D.M.YYYY");
    var theme = parserUtil.parseTheme(req);

    res.setHeader("Set-Cookie", ["theme=" + theme.id]);
    res.render(theme.template, { date: dateStr, restaurants: config.restaurants, themes: themes.themes });
});
app.get('/menu/:id', function(req, res) {
    if (typeof actions[req.params.id] === "undefined")
    {
        res.statusCode = 404;
        res.send('No menu found');
    }
    else
    {
        actions[req.params.id](function(menu) {
            res.json({ menu: menu, timeago: moment(menu.cacheTime).fromNow() });
        });
    }
});
console.log("Done");

app.listen(config.port);
console.log('Listening on port ' + config.port + '...');