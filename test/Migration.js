var should = require('should');
var Migration = require('../lib/Migration');

exports['test new Migration three args'] = function(){
  var date = new Date();
  var mig = new Migration('foo','bar', date);
  mig.should.be.an.instanceof(Migration);
  mig.title.should.equal('bar');
  mig.date.should.equal(date.getTime());
  mig.up_path.should.equal('foo/up/'+date.getTime()+'-bar.sql');
  mig.down_path.should.equal('foo/down/'+date.getTime()+'-bar.sql');

};

exports['test new Migration two args'] = function(){
  var date = new Date();
  var mig = new Migration(date.getTime()+'-bar.sql' ,'foo');
  mig.should.be.an.instanceof(Migration);
  mig.title.should.equal('bar');
  mig.date.should.equal(date.getTime());
  mig.up_path.should.equal('foo/up/'+date.getTime()+'-bar.sql');
  mig.down_path.should.equal('foo/down/'+date.getTime()+'-bar.sql');

};