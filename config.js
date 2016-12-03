module.exports = {
	port: process.env.PORT || 54321,
	cacheExpiration: 2 * 60 * 60 * 1000, //2h
	parserTimeout: 5 * 1000, //5s
	restaurants: [
	{ id: 1, name: 'U Daňováka', url: 'https://www.zomato.com/sk/bratislava/re%C5%A1taur%C3%A1cia-u-da%C5%88ov%C3%A1ka-petr%C5%BEalka-bratislava-v/denn%C3%A9-menu', module: 'zomato' },
	{ id: 2, name: 'Giuliano', url: 'http://www.giuliano.sk/-denne-menu', module: 'giuliano' },
	{ id: 3, name: 'ITB', url: 'http://www.citycantina.sk/prevadzka/1', module: 'itb' },
	{ id: 4, name: 'Alfa', url: 'http://restauracie.sme.sk/restauracia/restauracia-alfa_2512-petrzalka_664/denne-menu', module: 'alfa' },
	{ id: 5, name: 'Škôlka', url: 'http://jedalen.vysnivany.sk/ukazka-strany', module: 'skolka' },
	{ id: 6, name: 'Pizza Pazza', url: 'http://pizzapazza.sk/?page_id=645', module: 'pizzapazza', post: 'prevadzka2=1' },
	{ id: 7, name: 'Kamenica - Corleone Pizza', url: 'http://www.pizzacorleone.sk/obedove-menu.html', module: 'kamenica' },
	{ id: 8, name: 'Numero Uno', url: 'http://www.numerouno.sk/denne-menu/', module: 'numerouno' },
	{ id: 9, name: 'Engerau restaurant', url: 'https://www.zomato.com/sk/bratislava/engerau-restaurant-petr%C5%BEalka-bratislava-v/denn%C3%A9-menu', module: 'engerau' },
	{ id: 10, name: 'Lokálka', url: 'http://www.lokalka.sk/kopcianska-2/', module: 'lokalka' }
	],
	themes: {
		'jano': { name: 'Jano', template: '../views/index.html' },
		'matus': { name: 'Matúš', template: '../views/index3.html' },
		'iveta': { name: 'Iveta', template: '../views/index4.html' },
		'diana': { name: 'Diana', template: '../views/index6.html' },
		'telka': { name: 'Telka', template: '../views/index5.html' }
	}
};
