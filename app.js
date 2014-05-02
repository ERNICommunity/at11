var express = require('express');
var hbs = require('hbs');
var urlModule = require('url');
var moment = require("moment");
var momentTz = require("moment-timezone");

//our modules
var config = require('./config');
var menuFetcher = require('./menuFetcher');

console.log("Initializing...");
var actions = new Array();
for (var i = 0; i < config.restaurants.length; i++) {
    console.log(config.restaurants[i]);
    try
    {
        var module = require("./parsers/" + config.restaurants[i].module);
        if(typeof module.parse !== "function")
            throw "Module is missing parse method";
        if(module.parse.length !== 1)
            throw "Module parse(..) method should have 1 parameter (html)";
        var url = config.restaurants[i].url;
        var name = config.restaurants[i].name;
        var id = config.restaurants[i].id;
        var action = (function(id, name, url, parseCallback){
            return function(fetchedCallback)
                {
                    menuFetcher.fetchMenu(id, url, name, parseCallback, fetchedCallback);
                };
        })(id, name, url, module.parse);
        actions.push(action);
    }
    catch(e)
    {
        console.log(e);
    }
}

if(actions.length === 0)
{
    console.log("Initialization failed, exiting");
    process.exit(1);
}

console.log("Initialization successful (" + actions.length + " of " + config.restaurants.length + ")");

/* global setup */
global.devMode = false; //if set to true, cache is disabled
moment.lang('sk');
global.todaysDate = moment().tz("Europe/Bratislava");

var app = express();
app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.static('static'));
app.get('/', function(req, res) {
    loadRestaurants(function(restaurants){
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        res.setHeader('Content-Language', 'sk');
        var dateStr = global.todaysDate.format("dd D. M. YYYY");
        var theme = parseTheme(req);

        res.setHeader("Set-Cookie", ["theme="+ theme]);
        res.render(theme, { date: dateStr, restaurants: restaurants});
    });
});
app.listen(config.port);
console.log('Listening on port ' + config.port + '...');

function loadRestaurants(callback) {
    var results = [];
    var menuLoaded = function(restaurant) {
        restaurant.timeago = moment(restaurant.menu.cacheTime).fromNow();
        results.push(restaurant);
        if (results.length === actions.length) {
            results = results.sort(function(a,b) { return a.id - b.id });
            callback(results);
        }
    };

    for(var i = 0; i < actions.length; i++) {
        actions[i](menuLoaded);
    }
}

function parseTheme(req) {
    var parsedUrl = urlModule.parse(req.url, true);
    var cookies = parseCookies(req);

    //if no parameter is defined in URL, use cookies (if any)
    if (!parsedUrl.query.theme && typeof(cookies.theme) != "undefined") {
        return cookies.theme;
    }

    //use parameter from URL or default if not defined
    return (parsedUrl.query && parsedUrl.query.theme) || "index";
}

function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = unescape(parts.join('='));
    });

    return list;
}
