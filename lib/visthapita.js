

module.exports.version = '0.0.1';

module.exports.create = function(dir,env,config){
  //get driver
  //create migration table if not exists
  //create migration files
  //return
};

module.exports.up = function(dir,env,config,name){
  //get driver
  //work out all migrations not performed or use name
  //if not already applied
  //perform in date order, wrap with a transaction and migration table update
};

module.exports.down = function(dir,env,config, name){
  //get driver
  //perform migration wrap with a transaction and migration table delete
};