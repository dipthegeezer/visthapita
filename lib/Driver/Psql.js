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
      throw err;
    }
    callback(queryResult);
  };
}

//override here
Psql.prototype.up = function(migration, callback){
  pg.connect(
    this.connectionString, handle_error(
      function(client) {
        client.query( "BEGIN;", handle_error(
          function(result){
            client.query( migration.up, handle_error(
              function(result){
                client.query(
                  "INSERT INTO migrations(name,updated) VALUES(\'$1\',$2);",
                  [migration.name, new Date()],
                  handle_error( function(result){
                    client.query("COMMIT;", callback);
                  })
                );
              })
            );
          })
        );
      })
  );
};

Psql.prototype.down = function(migration, callback){
  pg.connect(
    this.connectionString, handle_error(
      function(client) {
        client.query( "BEGIN;", handle_error(
          function(result){
            client.query( migration.down, handle_error(
              function(result){
                client.query(
                  "DELETE FROM migrations where name = \'$1\';",
                  [migration.name],
                  handle_error( function(result){
                    client.query("COMMIT;", callback);
                  })
                );
              })
            );
          })
        );
      })
  );
};

Psql.prototype.createMigration = function(callback){
  pg.connect(
    this.connectionString, handle_error(
      function(client) {
        client.query(
          "SELECT * FROM pg_tables WHERE tablename='migrations'",
          handle_error( function(result){
            if(!result.rows.length){
              client.query( "", callback );
            }
            else{
              callback();
            }
          })
        );
      })
  );
};


Psql.prototype.getAppliedMigrations = function(name,callback){};

module.exports = Psql;
