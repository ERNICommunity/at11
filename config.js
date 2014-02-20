module.exports = {
    port:  process.env.PORT || 54321,
    cacheExpiration: 2*60*60*1000, //2h
    restaurants: [
        {name: "U Daňováka", url: "http://www.obedovat.sk/restauracia/6801-u-danovaka/denne-menu", module: "obedovat"},
        {name: "Giuliano", url: "http://www.giuliano.sk/sk/denne-menu/", module: "giuliano"},
        {name: "ITB", url: "http://www.obedovat.sk/restauracia/1047-jedalen-7-plus/denne-menu", module: "obedovat"},
        {name: "Alfa", url: "http://www.obedovat.sk/restauracia/150-alfa/denne-menu", module: "obedovat"},
        {name: "Škôlka", url: "http://jedalen.vysnivany.sk/ukazka-strany", module: "skolka"},
        {name: "Pizza Pazza", url: "http://www.pizzapazza.sk/sk/denne-menu/", module: "pizzapazza"}
    ]
};
