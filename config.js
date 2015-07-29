module.exports = {
    port: process.env.PORT || 54321,
    cacheExpiration: 2 * 60 * 60 * 1000, //2h
    globalTickInterval: 2 * 60 * 1000, //2m
    parserTimeout: 20 * 1000, //20s
    restaurants: [
        { id: 0, name: "Jedáleň u Daňováka II", url: "https://www.zomato.com/sk/bratislava/jed%C3%A1le%C5%88-u-da%C5%88ov%C3%A1ka-2-petr%C5%BEalka-bratislava-v/menu#tabtop", module: "zomato" },
        { id: 1, name: "U Daňováka", url: "https://www.zomato.com/sk/bratislava/re%C5%A1taur%C3%A1cia-u-da%C5%88ov%C3%A1ka-petr%C5%BEalka-bratislava-v/menu#tabtop", module: "zomato" },
        { id: 2, name: "Giuliano", url: "http://www.giuliano.sk/sk/denne-menu/", module: "giuliano" },
        { id: 3, name: "ITB", url: "http://www.citycantina.sk/prevadzka/1", module: "itb" },
        { id: 4, name: "Alfa", url: "http://restauracie.sme.sk/restauracia/restauracia-alfa_2512-petrzalka_664/denne-menu", module: "alfa" },
        { id: 5, name: "Škôlka", url: "http://jedalen.vysnivany.sk/ukazka-strany", module: "skolka" },
        { id: 6, name: "Pizza Pazza", url: "http://www.pizzapazza.sk/sk/denne-menu/", module: "pizzapazza" },
        { id: 7, name: "Kamenica - Corleone Pizza", url: "http://restauracie.sme.sk/restauracia/kamenica-corleone-pizza_660-petrzalka_664/denne-menu", module: "sme" },
        { id: 8, name: "Numero Uno", url: "http://www.numerouno.sk/denne-menu-5/", module: "numerouno" },
        { id: 9, name: "Engerau restaurant", url: "https://www.zomato.com/sk/bratislava/engerau-restaurant-petr%C5%BEalka-bratislava-v/menu#tabtop", module: "zomato" }
    ],
    themes: {
        "jano": { name: "Jano", template: "../views/index.html" },
        "matus": { name: "Matúš", template: "../views/index3.html" },
        "iveta": { name: "Iveta", template: "../views/index4.html" },
        "telka": { name: "Telka", template: "../views/index5.html" }
    }
};
