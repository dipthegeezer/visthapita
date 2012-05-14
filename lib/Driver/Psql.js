var util = require("util")
  , pg = require('pg').native
  , Driver = require(__dirname+"/../Driver")
  , Migration = require(__dirname+"/../Migration");

Psql = function(config) {
  Driver.call(this);
  this.config = {
    user: config.user,
    password: config.password,
    database: config.database,
    host: config.host,
    port: config.port
  };
};

util.inherits(Psql, Driver);

//override here
Psql.prototype.up = function(migration, callback){
  pg.connect(
    this.config, Driver.handle_error(
      callback,
      function(client) {
        client.query( "BEGIN", Driver.handle_error(
          callback,
          function(result){
            client.query( migration.up, Driver.handle_error(
              callback,
              function(result){
                client.query(
                  "INSERT INTO migrations(name,updated) "
                  + "VALUES(\'$1\',$2)",
                  [migration.name, new Date()],
                  Driver.handle_error( callback, function(result){
                    client.query("COMMIT",callback);
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
    this.config, Driver.handle_error(
      callback,
      function(client) {
        client.query( "BEGIN", Driver.handle_error(
          callback,
          function(result){
            client.query( migration.down, Driver.handle_error(
              callback,
              function(result){
                client.query(
                  "DELETE FROM migrations where name = \'$1\'",
                  [migration.name],
                  Driver.handle_error( callback, function(result){
                    client.query("COMMIT",callback);
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
    this.config, Driver.handle_error(
      callback,
      function(client) {
        client.query(
          "SELECT * FROM pg_tables WHERE tablename='migrations'",
          Driver.handle_error( callback, function(result){
            if(!result.rows.length){
              client.query(
                "CREATE TABLE migrations"
                + "(name TEXT PRIMARY KEY,"
                + "updated TIMESTAMP)", callback );
            }
            else{
              callback(null,result);
            }
          })
        );
      })
  );
};

Psql.prototype.getAppliedMigrations = function(dir,callback){
  pg.connect(
    this.config, Driver.handle_error(
      callback,
      function(client) {
        client.query(
          "SELECT * FROM migrations order by updated DESC",
            Driver.handle_error( callback, function(result){
              var migrations = result.rows.map(function(element){
                  // we are 'cheating' the interface :
                return new Migration(dir, element.name + '.sql');
              });
              callback(null,migrations);
            })
        );
      }
    )
  );
};

module.exports = Psql;
