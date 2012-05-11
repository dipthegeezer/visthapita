var util = require("util")
  , pg = require('pg').native
  , Driver = require(__dirname+"/../Driver")
  , Migration = require(__dirname+"/../Migration");

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
                  "INSERT INTO migrations(name,updated) "
                  + "VALUES(\'$1\',$2);",
                  [migration.name, new Date()],
                  handle_error( function(result){
                    client.query("COMMIT;",
                                 handle_error(callback));
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
                    client.query("COMMIT;",
                                 handle_error(callback));
                  })
                );
              })
            );
          })
        );
      })
  );
};

Psql.prototype.createMigrationsTable = function(callback){
  pg.connect(
    this.connectionString, handle_error(
      function(client) {
        client.query(
          "SELECT * FROM pg_tables WHERE tablename='migrations'",
          handle_error( function(result){
            if(!result.rows.length){
              client.query(
                "CREATE TABLE migrations"
                + "(name TEXT PRIMARY KEY,"
                + "updated TIMESTAMP)", handle_error(callback) );
            }
            else{
              callback(result);
            }
          })
        );
      })
  );
};

Psql.prototype.getAppliedMigrations = function(dir,callback){
  pg.connect(
    this.connectionString, handle_error(
      function(client) {
        client.query(
          "SELECT * FROM migrations order by updated",
            handle_error( function(result){
              var migrations = result.rows.map(function(element){
                  // we are 'cheating' the interface :
                return new Migration(dir, element.name + '.sql');
              });
              callback(migrations);
            })
        );
      }
    )
  );
};

module.exports = Psql;
