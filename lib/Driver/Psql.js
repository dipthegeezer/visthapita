var util = require("util")
  , pg = require('pg').native
  , Driver = require("../Driver");

Psql = function(path) {
  Driver.call(path);
};

util.inherits(Psql, Driver);

function handle_error(callback) {
  return function(err, queryResult) {
    if(err) {
    }
    callback(queryResult);
  };
}

//override here
Psql.prototype.createMigration = function(callback){
  console.log("basr");
};

Psql.prototype.apply = function(sql, callback){
  pg.connect(
    this.connectionString,
    function(client) {
      client.query( "BEGIN;", handle_error(
          function(result){
            client.query( sql, handle_error(
                function(result){
                  client.query("COMMIT;", callback(err,result));
                }
              )
            );
          }
        )
      );
    }
  );
};

Psql.prototype.getAppliedMigrations = function(name,callback){};

module.exports = Psql;
