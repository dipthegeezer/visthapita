var should = require('should');
var Driver = require('../../lib/Driver/Psql');
var sinon = require('sinon');

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
});

