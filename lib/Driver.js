/*!
 * visthapita
 * Copyright(c) 2012 D Patel <dipthegeezer.opensource@gmail.com>
 * MIT Licensed
 */

/**
 * Interface Class.
 * Danger Will Robinson!! All errors are handled internally
 *
 */

Driver = function(path) {};

/**
 * Create the migration table
 *
 * @param {Function} callback
 * @api public
 */
Driver.prototype.createMigrationsTable = function(callback){
};

/**
 * Perform an up migration
 *
 * @param {Migration} migration
 * @param {Function} callback
 * @api public
 */
Driver.prototype.up = function(migration, callback){
  //wrap in begin and end transaction
  //update the migration table
};

/**
 * Perform a down migration
 *
 * @param {Migration} migration
 * @param {Function} callback
 * @api public
 */
Driver.prototype.down = function(migration, callback){
  //wrap in begin and end transaction
  //update the migration table
};

/**
 * All the applied migrations via the migration table in
 * Ascending order of date applied.
 *
 * @param {String} dir
 * @param {Function} callback to which migrations are passed.
 * @api public
 */
Driver.prototype.getAppliedMigrations = function(dir,callback){
  //return list of migration objects applied
  //in order of date applied???
};

/**
 * Expose the Migration object.
 */
module.exports = Driver;
