var sqlite3 = require('sqlite3').verbose();
var db;
var userTable;

exports.initDB = function(dbpath,dbname,tablename){
  createDb(dbpath,dbname);
  userTable = tablename;
  createUserTable(userTable);
}

function createDb(dbpath,dbname) {
  db = new sqlite3.Database(dbpath + dbname + '.sqlite3');
}

function createUserTable(tablename) {
  db.run("CREATE TABLE IF NOT EXISTS " + tablename + " (userid TEXT PRIMARY KEY, authToken TEXT )");
}

exports.insertUser = function(userid,authToken) {
  var stmt = db.prepare("INSERT INTO " + userTable + " VALUES (?,?)");
  stmt.run(userid,authToken);
}

exports.updateUser = function(userid, authToken, callback) {
  db.all("UPDATE " + userTable + " set authToken = '" + authToken + "' where userid = '" + userid + "'", function(err, rows) {
    callback(err,rows);
  });
}

exports.deleteUser = function(userid, callback) {
  db.all("DELETE FROM " + userTable + " where userid = '" + userid + "'", function(err, rows) {
    callback(err,rows);
  });
}

exports.readUser = function(userid, callback) {
  db.all("SELECT userid, authToken FROM " + userTable + " where userid = '" + userid + "'", function(err, rows) {
    callback(err,rows);
  });
}

exports.readAllUsers = function(callback) {
  db.all("SELECT rowid AS id, userid, authToken FROM " + userTable, function(err, rows) {
    callback(err,rows);
  });
}

exports.closeDb = function() {
  db.close();
}