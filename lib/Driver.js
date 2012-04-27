
Driver = function(path) {
};

//interface to override

Driver.prototype.createMigration = function(callback){
  //check table exists
  //create
  //execute callback(err)
};

Driver.prototype.apply = function(sql, callback){
  //wrap in begin and end transaction
  //update the migration table
};

Driver.prototype.getAppliedMigrations = function(name,callback){};


module.exports = Driver;


//driver.createMigration( function(){ if (err){bail}} else{create files} );
//driver.apply(sql,function(){err,result});