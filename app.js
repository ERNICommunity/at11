var config = require('./config');
var express = require('express');
var hbs = require('hbs');
var danovak = require('./danovak');
var giuliano = require('./giuliano');

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

console.log('Listening on port ' + config.port + '.');

function loadRestaurants(callback) {
	var result = [];

	var done = function() {
		if (result.length === 2) {
			callback(result);
		}
	}
	
	danovak.readDailyMenu(function(menu){
		result.push(menu);
		done();
	});

	giuliano.readDailyMenu(function(menu){
		result.push(menu);
		done();
	});
};