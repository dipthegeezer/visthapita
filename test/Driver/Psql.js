var should = require('should');
var Driver = require('../../lib/Driver/Psql');

exports['test we have something'] = function(){
  var driver = new Driver();
  driver.print();
  driver.should.be.an.instanceof(Psql);
};