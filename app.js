var express = require('express');
var hbs = require('hbs');
var moment = require("moment-timezone");

//our modules
var config = require('./config');
var menuFetcher = require('./menuFetcher');
var parserUtil = require('./parsers/parserUtil');

console.log("Initializing...");
var actions = {};
function createAction(url, postParams, parseCallback) {
    return function(date, doneCallback) {
        menuFetcher.fetchMenu(url, date, postParams, parseCallback, doneCallback);
    };
}
for (var i = 0; i < config.restaurants.length; i++)
{
    console.log(config.restaurants[i]);
    try
    {
        var parserModule = require("./parsers/" + config.restaurants[i].module);
        if (typeof parserModule.parse !== "function")
        {
            throw "Module is missing parse method";
        }
        if (parserModule.parse.length !== 3)
        {
            throw "Module parse(..) method should have 3 parameters (html, date, callback)";
        }
        var id = config.restaurants[i].id;
        if (typeof actions[id] !== "undefined")
        {
            throw "Non unique id '" + id + "' provided";
        }
        var url = config.restaurants[i].url;
        var postParams = config.restaurants[i].post;
        actions[id] = createAction(url, postParams, parserModule.parse);
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
moment.tz.setDefault("Europe/Bratislava");
console.log("Done");

console.log("Express setup...");
var app = express();
app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.static('static'));
app.get('/:theme?', function(req, res) {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.setHeader('Content-Language', 'sk');
    var theme = parserUtil.parseTheme(req);

    res.cookie('theme', theme, { maxAge: 315360000000, httpOnly: true });
    res.render(config.themes[theme].template, { restaurants: config.restaurants, themes: config.themes });
});
app.get('/menu/:id/:day', function(req, res) {
    if (typeof actions[req.params.id] === "undefined")
    {
        res.statusCode = 404;
        res.send("Restaurant " + req.params.id + " not found\n");
    }
    else
    {
        actions[req.params.id](moment(req.params.day), function(error, cachedMenu) {
            if (error)
            {
                res.statusCode = 500;
                res.send(error.toString());
            }
            else
            {
                res.json(cachedMenu ? { menu: cachedMenu.value, timeago: moment(cachedMenu.timestamp).fromNow() } : null);
            }
        });
    }
});
console.log("Done");

app.listen(config.port);
console.log('Listening on port ' + config.port + '...');
