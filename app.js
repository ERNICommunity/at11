var flash = require('connect-flash')
var express = require('express');
var hbs = require('hbs');
var urlModule = require('url');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var dao = require('./dao');


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
        var id = config.restaurants[i].id;
        var action = (function (id, name, url, parseCallback) {
            return function (fetchedCallback) {
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


var users = [
    { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' }
    , { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];

function findUserById(id, fn) {
    var idx = id - 1;
    if (users[idx]) {
        fn(null, users[idx]);
    } else {
        fn(new Error('User ' + id + ' does not exist'));
    }
}

function findByUsername(username, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        if (user.username === username) {
            return fn(null, user);
        }
    }
    return fn(null, null);
}

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    findUserById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        process.nextTick(function () {

            findByUsername(username, function(err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
                //todo compare password hash!! not plaintext
                if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
                return done(null, user);
            })
        });
    }
));


var app = express();
app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.static('static'));
app.configure(function() {
//    app.use(express.logger());
    app.use(express.cookieParser("thissecretrocks"));
    app.use(express.bodyParser());
    app.use(express.methodOverride()); // must come after bodyParser
    app.use(express.session({ secret: 'thissecretrocks', cookie: { maxAge: 60000 } }));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
});

app.get('/',  function(req, res) {
	loadRestaurants(function(restaurants){
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        res.setHeader('Content-Language', 'sk');

        var parsedUrl = urlModule.parse(req.url, true).query;
        if (parsedUrl.action){
            res.render("login");
            return;
        }

        var now = new Date();
        var date = now.getDate() + ". " + (now.getMonth() + 1) + ". " + now.getFullYear();

        var theme = parseTheme(req);

        if (req.user && req.user.username){
            console.log("auth ok="+req.user.username);
        }else{
            console.log("auth fail");
        }

        res.setHeader("Set-Cookie", ["theme="+ theme]);
        res.render(theme, { date: date, restaurants: restaurants});

    });
});

app.get('/loginerror',  function(req, res) {
    res.redirect("/?action=auth");
});

app.post('/login',
    passport.authenticate('local', { failureRedirect: '/loginerror', failureFlash: true }),
    function(req, res) {
        res.redirect('/');
    });

app.listen(config.port);
console.log('Listening on port ' + config.port + '...');

function loadRestaurants(callback) {
    var results = [];
    var menuLoaded = function (restaurant) {
        results.push(restaurant);
        if (results.length === actions.length) {
            callback(results);
        }
    };

    for (var i = 0; i < actions.length; i++) {
        actions[i](menuLoaded);
    }
}

function parseTheme(req) {
    if (isMobileDevice(req)) {
        return "index";
    }

    var parsedUrl = urlModule.parse(req.url, true);
    var cookies = parseCookies(req);

    //if no parameter is defined in URL, use cookies (if any)
    if (!parsedUrl.query.theme && typeof(cookies.theme) != "undefined") {
        return cookies.theme;
    }

    //use parameter from URL or default if not defined
    return (parsedUrl.query && parsedUrl.query.theme) || "index";
}

function isMobileDevice(req) {
    //code originated from http://detectmobilebrowsers.com/
    var ua = req.headers['user-agent'].toLowerCase();
    return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|android|ipad|playbook|silk/i.test(ua) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substr(0, 4)));
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
