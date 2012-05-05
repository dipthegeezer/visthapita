
Driver = function(path) {
};

//interface to override
//Danger Will Robinson!! All errors are handled internally

Driver.prototype.createMigrationsTable = function(callback){
  //check table exists
  //create
  //execute callback()
};

Driver.prototype.up = function(migration, callback){
  //wrap in begin and end transaction
  //update the migration table
};

Driver.prototype.down = function(migration, callback){
  //wrap in begin and end transaction
  //update the migration table
};

Driver.prototype.getAppliedMigrations = function(callback){
  //return list of migration objects applied
  //in order of date applied???
};

module.exports = Driver;
