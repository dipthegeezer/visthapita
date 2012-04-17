var fs = require('fs')
  , path = require('path');

function formatName(title, date) {
  return formatDate(date) + '-' + title;
}

function formatDate(date) {
  return date.getTime();
}

function parseName(path) {
  var match = path.match(/(\d{14}-[^.]+)\.sql/);
  return match[1];
};

function parseDate(name) {
  var match = name.match(/(\d+)-[^\.]+/);
  var date = new Date(match[1]);
  return date;
}

function parseTitle(name) {
  var match = name.match(/\d+-([^\.]+)/);
  return match[1];
}


Migration = function() {
  if (arguments.length == 3) {
    this.title = arguments[1];
    this.date = arguments[2];
    this.name = formatName(this.title, this.date);
    this.up_path = arguments[0]+'/up/'+this.name+'.sql';
    this.down_path = arguments[0]+'/down/'+this.name+'.sql';
  } else if (arguments.length == 2) {
    this.name = parseName(arguments[0]);
    this.date = parseDate(this.name);
    this.title = parseTitle(this.name);
    this.up_path = arguments[1]+'/up/'+this.name+'.sql';
    this.down_path = arguments[1]+'/down/'+this.name+'.sql';
  }
};


Migration.loadFromFilesystem = function(dir, callback) {
  fs.readdir(dir+'/up/', function(err, files) {
    if (err) { callback(err); return; }
    files = files.filter(function(file) {
      return /\.sql$/.test(file);
    });
    var migrations = files.sort().map(function(file) {
      return new Migration(path.join(dir, file),dir);
    });
    callback(null, migrations);
  });
};

Migration.loadFromDatabase = function(dir, db, callback) {
  driver.getAllMigrations( function(err, dbResults) {
    if (err) { callback(err); return; }
    var migrations = dbResults.map(function(result) {
      return new Migration(path.join(dir, result.name + '.sql'), dir);
    });
    callback(null, migrations);
  });
};

module.exports = Migration;
