var should = require('should')
  , visthapita = require(__dirname+'/../lib/visthapita')
  , Migration = require(__dirname+'/../lib/Migration')
  , Psql = require(__dirname+'/../lib/Driver/Psql')
  , fs = require('fs')
  , sinon = require('sinon');

suite('visthapita', function(){
  var mockPg;
  setup(function(){
    mockPg = sinon.mock(require('pg').native);
  });
  teardown(function(){
    mockPg.restore();
  });
  test('#version', function(){
    visthapita.version.should.be.a('string');
  });
  test('#getDriver() throws Error on unknown', function(){
    (function(){
       visthapita.getDriver({driver:'foo'});
     }).should.throw(
      "Unknown Database driver:foo"
    );
  });

  test('#getDriver() returns Psql object', function(){
    var driver = visthapita.getDriver({driver:'psql'});
    driver.should.be.an.instanceof(Psql);
  });

  test('#create() error to callback', function(done){
    mockPg.expects('connect').yields(null, {
      query: function () {
        var sql = arguments[0];
        var callback = arguments[arguments.length - 1];
        callback(new Error("Some Error"),null);
      }
    });
    visthapita.create({driver:'psql'},'foo',function(err,result){
      err.should.be.instanceof(Error);
      done();
    });
  });

  test('#create()', function(done){
    mockPg.expects('connect').yields(null, {
      query: function () {
        var sql = arguments[0];
        var callback = arguments[arguments.length - 1];
        if(sql.match(/pg_tables/)){
          callback(null,{rows:[]});
        }
        if(sql.match(/CREATE/)){
          callback();
        }
      }
    });
    visthapita.create({driver:'psql',dir:'/tmp/'},'foo',
    function(err,migration){
      migration.should.be.instanceof(Migration);
      migration.title.should.equal('foo');
      fs.statSync(migration.down_path).size.should.equal(0);
      fs.statSync(migration.up_path).size.should.equal(0);
      fs.unlinkSync(migration.down_path);
      fs.unlinkSync(migration.up_path);
      fs.rmdirSync('/tmp/up');
      fs.rmdirSync('/tmp/down');
      done();
    });
  });

  test( '#up_all()', function(){
  });

  test( '#up()', function(){
  });

  test( '#down()', function(){
    var date = new Date();
    mockPg.expects('connect').yields(null, {
      query: function () {
        var callback = arguments[arguments.length - 1];
        var sql = arguments[0];
        if(sql.match(/SELECT/)){
          callback(null,{ rows:[{name:date.getTime()+"-baboon_baby"}]});
        }
        else{
          callback();
        }
      }
    });
    visthapita.down({driver:'psql',dir:'/tmp/migration'},'foo',
    function(err,result){
      done(err);
    });
  });
});