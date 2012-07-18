/*!
 * visthapita
 * Copyright(c) 2012 D Patel <dipthegeezer.opensource@gmail.com>
 * MIT Licensed
 */

/**
 * External module dependencies.
 */
var fs = require('fs')
  , path = require('path');


/**
 * Return a String of the formatted `title` and `date`.
 *
 * @param {String} title
 * @param {Date} date
 * @return {String}
 * @api private
 */
function formatName(title, date) {
  return formatDate(date) + '-' + title;
}

/**
 * Return time epoch of the given `date` object.
 *
 * @param {Date} date
 * @return {Int}
 * @api private
 */
function formatDate(date) {
  return date.getTime();
}

/**
 * Return name of the migration from the given `path`.
 *
 * @param {String} path
 * @return {String}
 * @api private
 */
function parseName(path) {
  var match = path.match(/(\d+-[^.]+)\.sql/);
  return match[1];
};
/**
 * Return Date of the migration from its given file `name`.
 *
 * @param {String} name
 * @return {Date}
 * @api private
 */
function parseDate(name) {
  var match = name.match(/(\d+)-[^\.]+/);
  return new Date(parseInt(match[1]));
}
/**
 * Return title of the migration from its given file `name`.
 *
 * @param {String} name
 * @return {String}
 * @api private
 */
function parseTitle(name) {
  var match = name.match(/\d+-([^\.]+)/);
  return match[1];
}
/**
 * Set the up and down paths and load files if they exist from the `migration` object.
 *
 * @param {String} dir
 * @param {Migration} migration
 * @api private
 */
function setUpDown(dir, migration){
  migration.root_dir = dir;
  migration.up_path = dir+'/up/'+migration.name+'.sql';
  migration.down_path = dir+'/down/'+migration.name+'.sql';
  if (fs.existsSync(migration.up_path)){
    migration.up = fs.readFileSync(migration.up_path,'utf8');
  }
  if(fs.existsSync(migration.down_path)){
    migration.down = fs.readFileSync(migration.down_path,'utf8');
  }
}
/**
 * New Migration Object
 *
 * @param {String} path
 * @param {String} title
 * @param {Date} date
 * or
 * @param {String} path
 * @param {String} filename
 * @api public
 */
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

/**
 * Create the up and down files for the migration.
 *
 * @param {Function} callback
 *
 * @api public
 */
Migration.prototype.createFiles = function(callback){
  var mig = this;
  this.createFile('up',function(err){
    if(err) {callback(err);}
    else{
      mig.createFile('down',function(err){
        callback(err,mig);
      });
    }
  });
};
/**
 * Create a migration file.
 *
 * @param {String} direction
 * @param {Function} callback
 *
 * @api public
 */
Migration.prototype.createFile = function(direction, callback){
  var mig = this;
  fs.exists( mig.root_dir + '/'+direction+'/', function(exists) {
    if(exists){
      fs.writeFile(mig[direction+'_path'],'','utf8', callback);
    }
    else{
      fs.mkdir(mig.root_dir + '/'+direction+'/', 0755, function(e){
        if(e){ callback(e);}
        else{ fs.writeFile(mig[direction+'_path'],'','utf8', callback);}
      });
    }
  });
};
/**
 * Load all the migrations from the filesystem and instantiate as a list of Migration objects that is passed to the callback function.
 *
 * @param {String} dir
 * @param {Function} callback
 * @api public
 */
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

/**
 * Expose the Migration object.
 */
module.exports = Migration;
