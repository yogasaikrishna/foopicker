// FooPicker Tests

var assert = require('assert');
describe('Array', function() {

  describe('#indexOf', function() {
    it('Should return -1 when the value is not present', function() {
      assert.equal(-1, [1, 2, 3].indexOf(5));
    });
  });

  describe("#join", function() {
    it('Should join the array', function() {
      assert.equal("1,2,3", [1, 2, 3].join());
    });
  });

});
