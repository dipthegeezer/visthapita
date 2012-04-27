var util = require("util")
  , Driver = require("../Driver");

Psql = function(path) {
  Driver.call(path);
};

util.inherits(Psql, Driver);

//override here
Psql.prototype.createMigration = function(callback){
  console.log("basr");
};

Psql.prototype.apply = function(sql, callback){};

Psql.prototype.getAppliedMigrations = function(name,callback){};

module.exports = Psql;
