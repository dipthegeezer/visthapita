var should = require('should');
var Migration = require('../lib/Migration');

suite('Migration', function(){
  test('instantiated with three args', function(){
    var date = new Date();
    var mig = new Migration('foo','bar', date);
    mig.should.be.an.instanceof(Migration);
    mig.title.should.equal('bar');
    mig.date.should.equal(date.getTime());
    mig.up_path.should.equal('foo/up/'+date.getTime()+'-bar.sql');
    mig.down_path.should.equal('foo/down/'+date.getTime()+'-bar.sql');
  });

  test('instantiated with two args', function(){
    var date = new Date();
    var mig = new Migration('foo', date.getTime()+'-bar.sql');
    mig.should.be.an.instanceof(Migration);
    mig.title.should.equal('bar');
    mig.date.should.equal(date.getTime());
    mig.up_path.should.equal('foo/up/'+date.getTime()+'-bar.sql');
    mig.down_path.should.equal('foo/down/'+date.getTime()+'-bar.sql');
  });
});