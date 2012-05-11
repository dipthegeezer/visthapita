var util = require("util")
  , Driver = require(__dirname+"/../Driver");


Mysql = function(path) {
  Driver.call(this);
};

util.inherits(Mysql, Driver);

//override here
Mysql.prototype.createMigration = function(callback){
  console.log("basr");
};

Mysql.prototype.apply = function(sql, callback){};

Mysql.prototype.getAppliedMigrations = function(name,callback){};

module.exports = Mysql;
