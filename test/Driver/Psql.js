var should = require('should')
  , Driver = require('../../lib/Driver/Psql')
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
    driver.createMigrationsTable(function(results){done();});
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
});

