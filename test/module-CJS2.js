(function() {
  QUnit.module('Tests loading of interf with CJS modules');

  var context = window || global || self;

  QUnit.test('CJS exports defined', function(assert) {
    assert.ok(typeof context.exports === 'object', 'Test global exports');
  });

  QUnit.test('Require CJS context.exports supported', function(assert) {
    var interf = context.exports.interf;
    assert.ok(typeof context.interf === 'undefined', 'Test interf defined not glogaly');
    assert.ok(typeof interf.create === 'function', 'Test interf.create defined');
    assert.ok(typeof interf.VERSION === 'number', 'Test interf.VERSION defined');
  });
})();
