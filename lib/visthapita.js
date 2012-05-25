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
var Migration = require(__dirname+'/Migration')
  , Psql = require(__dirname+'/Driver/Psql');

/**
 * Expose the version.
 */
module.exports.version = '0.0.1';

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
 * @param {Object} config
 * @param {String} title
 * @param {Function} callback
 * @api public
 */
module.exports.create = function(config,title, callback){
  //get driver
  var driver = this.getDriver(config);
  //create migration table if not exists
  driver.createMigrationsTable(
    //create migration files
    function(err,result){
      if( err ) callback(err,null);
      else{
        var mig = new Migration(config.dir, title, new Date());
        mig.createFiles();
        callback(null,mig);
      }
    }
  );
  //return
};

/**
 * Perform the up migration `title` kept in the directory `dir`
 *
 * @param {Object} config
 * @param {String} title
 * @param {Function} callback
 * @api public
 */
module.exports.up = function(config,title, callback){
  //get driver
  var driver;
  //use name
  Migration.loadFromFilesystem(config.dir,function(err,file_migrations){
    if(err) throw err;//switch to callback err
    var migration = filterMigrations(title,file_migrations);
      if(migration){
        //check migration has not been appplied
        driver.getAppliedMigrations(config.dir,function(db_migrations){
          var db_migration = filterMigrations(title,db_migrations);
          if(db_migration!=null){
          //perform migration wrap with a transaction
          //and migration table delete
            driver.up(migration,callback);
          }
          else{
            //error to callback migration has been applied
            callback(new Error(title+' has been applied'));
          }
        });
      }
      else{
        //error to callback migration file not found
        callback(new Error(title+' migration not found'));
    }
  });
};
/**
 * Perform the all the unapplied up migrations kept in the directory `dir`
 *
 * @param {Object} config
 * @param {Function} callback
 * @api public
 */
module.exports.up_all = function(config,callback){
  //get driver
  var driver;
  //work out all migrations not performed
  Migration.loadFromFilesystem(
    dir,
    function(err,file_migrations){
      //perform in date order, wrap with a transaction
      //and migration table update
      driver.getAppliedMigrations(config.dir,function(db_migrations){
        var series_array = file_migrations.map(
          function(element) {
            for(var db_mig in db_migrations){
              if(element.title == db_mig.title) {
                return function(fn){
                  //empty callback ouch!
                };
              }
            }
            return function(fn){
              driver.up(element,fn);
            };
          });
          async.series(
            series_array, callback
          );
        });
      }
    );
};

/**
 * Perform the down migration of the last applied up migration kept in the directory `dir`
 *
 * @param {Object} config
 * @param {Function} callback
 * @api public
 */
module.exports.down = function(config, callback ){
  //get driver
  var driver = this.getDriver(config);
  driver.getAppliedMigrations(config.dir,function(db_migrations){
    var db_migration = db_migrations[0];
    if(db_migration){
      //perform migration wrap with a transaction
      //and migration table delete
      driver.down(migration,callback);
    }
    else{
      //error to callback migration has not been applied
      callback(
        new Error('No migrations have been applied to the DB.')
      );
    }
  });
};

/**
 * Method to return the appropriate Database driver.
 *
 * @param {Object} config
 * @return {Object} Relevant Driver object
 * @api public
 */
module.exports.getDriver = function(config) {
  if(config.driver.toLowerCase() == 'psql'){
    return new Psql(config);
  }
  throw new Error("Unknown Database driver:"+config.driver);
};