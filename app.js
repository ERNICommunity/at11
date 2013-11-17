var config = require('./config');
var express = require('express');
var hbs = require('hbs');
var giuliano = require('./giuliano');
var itb = require('./itb');
var obedovat = require('./obedovat');

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
		if (result.length === 4) {
			callback(result);
		}
	};

	obedovat.readDailyMenu(function(menu){
		result.push(menu);
		done();
	}, '6801-u-danovaka', 'U Daňováka');

	giuliano.readDailyMenu(function(menu){
		result.push(menu);
		done();
	});

	itb.readDailyMenu(function(menu){
		result.push(menu);
		done();
	});

    obedovat.readDailyMenu(function(menu){
		result.push(menu);
		done();
	}, '150-alfa', 'Alfa');
};
