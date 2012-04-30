var should = require('should');
var Driver = require('../../lib/Driver/Psql');

suite('Psql', function(){
  test('should be an instance of Psql', function(){
    var driver = new Driver();
    driver.should.be.an.instanceof(Psql);
  });
});

