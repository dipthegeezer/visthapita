var should = require('should')
  , Driver = require(__dirname+'/../../lib/Driver/Psql')
  , Migration = require(__dirname+'/../../lib/Migration')
  , sinon = require('sinon');

suite('Psql', function(){
  var mockPg;
  setup(function(){
    mockPg = sinon.mock(require('pg').native);
  });
  teardown(function(){
    mockPg.restore();
  });
  test('#new()', function(){
    var driver = new Driver();
    driver.should.be.an.instanceof(Psql);
  });
  test('#up()', function(done){
    mockPg.expects('connect').yields(null, {
      query: function () {
        var sql = arguments[0];
        var callback = arguments[arguments.length - 1];
        sql.should.match(/BEGIN|TEST|COMMIT|INSERT/);
        callback();
      }
    });
    var driver = new Driver();
    driver.up({up : "TEST;",name:"foo"},done);
  });
  test('#down()', function(done){
    mockPg.expects('connect').yields(null, {
      query: function () {
        var sql = arguments[0];
        var callback = arguments[arguments.length - 1];
        sql.should.match(/BEGIN|TEST|COMMIT|DELETE/);
        callback();
      }
    });
    var driver = new Driver();
    driver.down({down : "TEST;",name:"foo"},done);
  });
  test('#createMigrationsTable() table already exists', function(done){
    mockPg.expects('connect').yields(null, {
      query: function () {
        var sql = arguments[0];
        var callback = arguments[arguments.length - 1];
        if(sql.match(/pg_tables/)){
          callback(null,{rows:["foo"]});
        }
      }
    });
    var driver = new Driver();
    driver.createMigrationsTable(done);
  });
  test('#createMigrationsTable()', function(done){
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
    var driver = new Driver();
    driver.createMigrationsTable(done);
  });
  test('#getAppliedMigrations', function(done){
    var date = new Date();
    mockPg.expects('connect').yields(null, {
      query: function () {
        var callback = arguments[arguments.length - 1];
        callback(null,{ rows:[{name:date.getTime()+"-baboon_baby"}]});
      }
    });
    var driver = new Driver();
      driver.getAppliedMigrations("foo",function(err,mig){
      mig.length.should.equal(1);
      mig[0].should.be.an.instanceof(Migration);
      mig[0].title.should.equal('baboon_baby');
      mig[0].date.getTime().should.equal(date.getTime());
      done();
    });
  });
});

