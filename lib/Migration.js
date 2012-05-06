var fs = require('fs')
  , path = require('path');

function formatName(title, date) {
  return formatDate(date) + '-' + title;
}

function formatDate(date) {
  return date.getTime();
}

function parseName(path) {
  var match = path.match(/(\d+-[^.]+)\.sql/);
  return match[1];
};

function parseDate(name) {
  var match = name.match(/(\d+)-[^\.]+/);
  return new Date(parseInt(match[1]));
}

function parseTitle(name) {
  var match = name.match(/\d+-([^\.]+)/);
  return match[1];
}

function setUpDown(dir, migration){
  migration.up_path = dir+'/up/'+migration.name+'.sql';
  migration.down_path = dir+'/down/'+migration.name+'.sql';
  if (path.existsSync(migration.up_path)){
    migration.up = fs.readFileSync(migration.up_path,'utf8');
  }
  if(path.existsSync(migration.down_path)){
    migration.down = fs.readFileSync(migration.down_path,'utf8');
  }
}

Migration = function() {
  if (arguments.length == 3) {
    this.title = arguments[1];
    this.date = arguments[2];
    this.name = formatName(this.title, this.date);
    setUpDown(arguments[0],this);
  } else if (arguments.length == 2) {
    this.name = parseName(arguments[1]);
    this.date = parseDate(this.name);
    this.title = parseTitle(this.name);
    setUpDown(arguments[0],this);
  }
};

Migration.prototype.createFiles = function(){
  fs.writeFileSync(this.down_path,'','utf8');
  fs.writeFileSync(this.up_path,'','utf8');
};

Migration.loadFromFilesystem = function(dir, callback) {
  fs.readdir(dir+'/up/', function(err, files) {
    if (err) { callback(err); return; }
    files = files.filter(function(file) {
      return /\.sql$/.test(file);
    });
    var migrations = files.sort().map(function(file) {
      return new Migration(dir, file);
    });
    callback(null, migrations);
  });
};

module.exports = Migration;
