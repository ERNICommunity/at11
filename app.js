var express = require('express');
var hbs = require('hbs');

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
        var url = config.restaurants[i].url;
        var name = config.restaurants[i].name;
        var action = (function(name, url, parseCallback){
            return function(fetchedCallback)
                {
                    menuFetcher.fetchMenu(url, name, parseCallback, fetchedCallback);
                };
        })(name, url, module.parse);
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

var app = express();
app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.static('static'));
app.get('/', function(req, res) {
	loadRestaurants(function(restaurants){
		res.render('index', {restaurants: restaurants});
	});
});
app.listen(config.port);
console.log('Listening on port ' + config.port + '...');

function loadRestaurants(callback) {
	var results = [];
    var menuLoaded = function(restaurant) {
        results.push(restaurant);
        if (results.length === actions.length) {
            callback(results);
        }
    };

    for(var i = 0; i < actions.length; i++) {
        actions[i](menuLoaded);
    }
};
