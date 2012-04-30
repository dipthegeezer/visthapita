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
  test('#apply()', function(done){
    mockPg.expects('connect').yields(null, {
      query: function (sql, callback) {
        sql.should.match(/^BEGIN|TEST|COMMIT;$/);
        callback();
      }
    });
    var driver = new Driver();
    driver.apply("TEST;",done);
  });
});

