var should = require('should')
  , visthapita = require(__dirname+'/../lib/visthapita')
  , sinon = require('sinon');

suite('visthapita', function(){
  setup(function(){
  });
  teardown(function(){
  });
  test('#version', function(){
    visthapita.version.should.be.a('string');
  });

  test('#create()', function(){

  });

  test('#getDriver() throws Error on unknown', function(){
    (function(){
       visthapita.getDriver({driver:'foo'});
     }).should.throw(
      "Unknown Database driver:foo"
    );
  });

  test( '#up_all()', function(){
  });

  test( '#up()', function(){
  });

  test( '#down', function(){
  });
});