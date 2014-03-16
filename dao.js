var sqlite3 = require('sqlite3').verbose();
var fs = require("fs");
var file = "test.db";
var exists = fs.existsSync(file);


module.exports.findUserById = function () {

}

module.exports.findUserByUsername = function (username, fn) {
    db.serialize(function () {
        db.all("SELECT id, password FROM USERS WHERE username='"+username+"'", function(err, rows) {
            if (rows === 0){
                fn("No such user " + username, null);
                return;
            }
        });
    });
}

module.exports.initDatabase = function () {
    db.serialize(function () {
        if (!exists) {
            db.run("CREATE TABLE USERS (" +
                "userId INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "username TEXT UNIQUE NOT NULL, " +
                "password TEXT NOT NULL" +
                ")");
        }
    });
}

module.exports.createNewUser = function (username, passwordHash) {
    db.serialize(function () {
        var stmt = db.prepare("INSERT INTO USERS(USERNAME, PASSWORD) VALUES (?)");
        stmt.run(username, passwordHash);
        stmt.finalize();
    });
}

db.close();
