(function() {
  QUnit.module('Tests loading of interf with CJS modules');

  var context = window || global || self;

  QUnit.test('CJS defined', function(assert) {
    assert.ok(typeof context.R === 'function', 'Test global R');
  });

  QUnit.test('Require CJS supported', function(assert) {
    var done = assert.async();
    assert.expect(3);
    context.R(
      function(require) {
        var interf = require('../base/dist/interf');
        assert.ok(typeof context.interf === 'undefined', 'Test interf defined not glogaly');
        assert.ok(typeof interf.create === 'function', 'Test interf.create defined');
        assert.ok(typeof interf.VERSION === 'number', 'Test interf.VERSION defined');
      },
      function() {
        done();
      }
    );
  });
})();
