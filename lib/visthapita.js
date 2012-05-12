/*!
 * visthapita
 * Copyright(c) 2012 D Patel <dipthegeezer.opensource@gmail.com>
 * MIT Licensed
 */

/**
 * External module dependencies.
 */
var async = require('async');

/**
 * Module dependencies.
 */
var Migration = require(__dirname+'/Migration');

/**
 * Expose the version.
 */
module.exports.version = '0.0.1';


//TODO stick callbacks in

/**
 * Filter a list of Migration Objects by `title` to return the matching Migration Object.
 *
 * @param {String} title
 * @param {Array} migrations
 * @return {Migration}
 * @api private
 */
function filterMigrations(title,migrations){
  var filtered = migrations.filter(
    function(element, index, array) {
      return (element.title == title);
    }
  );
  if(filtered.length) return filtered[0];
  return null;
};

/**
 * Create the Migration table if it doesn't exist and the migration files secified by `title` in the directory `dir`
 *
 * @param {String} dir
 * @param {String} env
 * @param {Object} config
 * @param {String} title
 * @api public
 */
module.exports.create = function(dir,env,config,title){
  //get driver
  var driver;
  //create migration table if not exists
  driver.createMigrationsTable(
    //create migration files
    function(result){
      var mig = new Migration(dir, title, new Date());
      mig.createFiles();
    }
  );
  //return
};

/**
 * Perform the up migration `title` kept in the directory `dir`
 *
 * @param {String} dir
 * @param {String} env
 * @param {Object} config
 * @param {String} title
 * @api public
 */
module.exports.up = function(dir,env,config,title){
  //get driver
  var driver;
  //use name
  Migration.loadFromFilesystem(dir,function(err,file_migrations){
    if(err) throw err;//switch to callback err
    var migration = filterMigrations(title,file_migrations);
      if(migration){
        //check migration has not been appplied
        driver.getAppliedMigrations(dir,function(db_migrations){
          var db_migration = filterMigrations(title,db_migrations);
          if(db_migration!=null){
          //perform migration wrap with a transaction
          //and migration table delete
            driver.up(migration,function(){});
          }
          else{
            //error to callback migration has been applied
          }
        });
      }
      else{
        //error to callback migration file not found
    }
  });
};
/**
 * Perform the all the unapplied up migrations kept in the directory `dir`
 *
 * @param {String} dir
 * @param {String} env
 * @param {Object} config
 * @api public
 */
module.exports.up_all = function(dir,env,config){
  //get driver
  var driver;
  //work out all migrations not performed
  Migration.loadFromFilesystem(
    dir,
    function(err,file_migrations){
      //perform in date order, wrap with a transaction
      //and migration table update
      driver.getAppliedMigrations(dir,function(db_migrations){
        var series_array = file_migrations.map(
          function(element) {
            for(var db_mig in db_migrations){
              if(element.title == db_mig.title) {
                return function(callback){
                  //empty callback ouch!
                };
              }
            }
            return function(callback){
              driver.up(element,callback);
            };
          });
          async.series(
            series_array, function(err){
              if(err) throw err;//callback
            }
          );
        });
      }
    );
};

/**
 * Perform the down migration of the last applied up migration kept in the directory `dir`
 *
 * @param {String} dir
 * @param {String} env
 * @param {Object} config
 * @api public
 */
module.exports.down = function(dir, env, config ){
  //get driver
  var driver;
  //find applied migration
  Migration.loadFromFilesystem(dir,function(err,file_migrations){
    if(err) throw err;//switch to callback err
    var migration = filterMigrations(title,file_migrations);
    if(migration){
      //check migration has been appplied
      driver.getAppliedMigrations(dir,function(db_migrations){
        var db_migration = db_migrations[0];
        if(db_migration){
        //perform migration wrap with a transaction
        //and migration table delete
          driver.down(migration,function(){});
        }
        else{
          //error to callback migration has not been applied
        }
      });
    }
    else{
      //error to callback migration file not found
    }
  });
};

