module.exports = {
    port:  process.env.PORT || 54321,
    cacheExpiration: 2*60*60*1000, //2h
    globalTickInterval: 2*60*1000, //2m
    parserTimeout: 20*1000, //20s 
    restaurants: [
        {id: 0, name: "Jedáleň u Daňováka II", url: "http://www.obedovat.sk/restauracia/9812-jedalenudanovaka2/denne-menu", module: "obedovat"},
        {id: 1, name: "U Daňováka", url: "http://www.obedovat.sk/restauracia/6801-u-danovaka/denne-menu", module: "obedovat"},
        {id: 2, name: "Giuliano", url: "http://www.giuliano.sk/sk/denne-menu/", module: "giuliano"},
        {id: 3, name: "ITB", url: "http://www.itbfood.sk/index.php?id=1&type=main_menu&t=1", module: "itb"},
        {id: 4, name: "Alfa", url: "http://www.obedovat.sk/restauracia/150-alfa/denne-menu", module: "obedovat"},
        {id: 5, name: "Škôlka", url: "http://jedalen.vysnivany.sk/ukazka-strany", module: "skolka"},
        {id: 6, name: "Pizza Pazza", url: "http://www.pizzapazza.sk/sk/denne-menu/", module: "pizzapazza"},
        {id: 7, name: "Kamenica - Corleone Pizza", url: "http://restauracie.sme.sk/restauracia/kamenica-corleone-pizza_660-petrzalka_664/denne-menu", module: "sme"},
        {id: 8, name: "Numero Uno", url: "http://www.numerouno.sk/denne-menu-5/", module: "numerouno"},
        {id: 9, name: "Engerau restaurant", url: "http://www.obedovat.sk/restauracia/241-engerau-restaurant/denne-menu", module: "obedovat"},
        {id: 10, name: "Jedáleň Albatros", url: "http://www.obedovat.sk/restauracia/7088-albatros-jedalen/denne-menu", module: "obedovat"}
    ],
    themes: {
        "jano": { name: "Jano", template: "../views/index.html" },
        "igor": { name: "Igor", template: "../views/index2.html" },
        "matus": { name: "Matúš", template: "../views/index3.html" },
        "iveta": { name: "Iveta", template: "../views/index4.html" }
    }
};
