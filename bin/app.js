"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var express = __importStar(require("express"));
var hbs = __importStar(require("hbs"));
var moment = __importStar(require("moment-timezone"));
var cache_1 = require("./cache");
var config_1 = require("./config");
var menuFetcher_1 = require("./menuFetcher");
console.log("Initializing...");
var config = new config_1.Config();
var cache = new cache_1.Cache(config);
var menuFetcher = new menuFetcher_1.MenuFetcher(config, cache, process.env.AT11_NO_CACHE ? true : false);
var actions = new Array();
var _loop_1 = function (i) {
    console.log("Processing:", config.restaurants[i]);
    try {
        var parser_1 = require("./parsers/" + config.restaurants[i].parserName);
        var id = config.restaurants[i].id;
        if (typeof actions[id] !== "undefined") {
            throw new Error("Non unique id '" + id + "' provided");
        }
        var url_1 = config.restaurants[i].url;
        actions[id] = function (date, doneCallback) { return menuFetcher.fetchMenu(url_1, date, parser_1.parse, doneCallback); };
    }
    catch (e) {
        console.warn(e);
    }
};
for (var i = 0; i < config.restaurants.length; i++) {
    _loop_1(i);
}
if (Object.keys(actions).length === 0) {
    console.error("Initialization failed, exiting");
    process.exit(1);
}
console.log("Initialization successful (" + Object.keys(actions).length + " of " + config.restaurants.length + ")");
console.log("Registering partials...");
hbs.registerPartials(__dirname + "/views/partials");
console.log("Done");
console.log("Global setup...");
moment.locale("sk");
moment.tz.setDefault("Europe/Bratislava");
console.log("Done");
console.log("Express setup...");
var app = express();
app.set("view engine", "html");
app.engine("html", hbs.__express);
app.use(express.static("static"));
app.get("/", function (req, res) {
    res.setHeader("Content-Type", "text/html; charset=UTF-8");
    res.setHeader("Content-Language", "sk");
    res.render("../views/index.html", { restaurants: config.restaurants });
});
app.get("/menu/:id/:day", function (req, res) {
    if (typeof actions[req.params.id] === "undefined") {
        res.statusCode = 404;
        res.send("Restaurant " + req.params.id + " not found\n");
    }
    else {
        actions[req.params.id](moment(req.params.day, "YYYY-MM-DD"), function (error, cachedMenu) {
            if (error) {
                res.statusCode = 500;
                res.send(error.toString());
            }
            else {
                res.json(cachedMenu ? { menu: cachedMenu.value, timeago: moment(cachedMenu.timestamp).fromNow() } : null);
            }
        });
    }
});
console.log("Done");
console.log("Creating server...");
app.listen(config.port, function (err) {
    if (err) {
        console.error("Unable to create server", err);
        process.exit(1);
        return;
    }
    var host = _this.address().address;
    var port = _this.address().port;
    console.log("Done, listening on http://%s:%s", host, port);
});
//# sourceMappingURL=app.js.map