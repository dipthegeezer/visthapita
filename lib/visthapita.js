var Migration = require('Migration')
  , async = require('async');

module.exports.version = '0.0.1';

//stick callbacks in

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

module.exports.up = function(dir,env,config,name){
  //get driver
  var driver;
  //use name
  if(name!=null){
    //make sure migration not applied
    var migration;
    driver.up(migration,function(){});
  }
  else{
    //work out all migrations not performed
    var migrations;
    //perform in date order, wrap with a transaction
    //and migration table update
    var series_array=[];
    for (var migration in migrations){
      series_array.push(
        function(callback){
          driver.up(migration,callback);
        }
      );
    }
    async.series(
      series_array, function(err){
        if(err) throw err;
    });
  }
};

module.exports.down = function(dir, env, config, name){
  //get driver
  var driver;
  //find applied migration
  var migration;
  //perform migration wrap with a transaction
  //and migration table delete
  driver.down(migration,function(){});
};

