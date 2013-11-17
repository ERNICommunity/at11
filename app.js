var config = require('./config');
var express = require('express');
var hbs = require('hbs');

//our modules
var menuFetcher = require('./menuFetcher');
var obedovat = require('./obedovat');
var giuliano = require('./giuliano');
var itb = require('./itb');

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

	var done = function(restaurant) {
        result.push(restaurant);
		if (result.length === 4) {
			callback(result);
		}
	};

    menuFetcher.fetchMenu('http://www.obedovat.sk/restauracia/6801-u-danovaka/denne-menu',
        'U Daňováka', obedovat.parse, done);

    menuFetcher.fetchMenu('http://www.giuliano.sk/sk/denne-menu/',
        'Giuliano', giuliano.parse, done);

    menuFetcher.fetchMenu('http://itbfood.sk/index.php?id=1&type=main_menu&t=1',
        'ITB', itb.parse, done);

    menuFetcher.fetchMenu('http://www.obedovat.sk/restauracia/150-alfa/denne-menu',
        'Alfa', obedovat.parse, done);
};
