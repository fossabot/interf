(function() {
  QUnit.module('Tests loading of interf with AMD modules');

  var context = window || global || self;

  QUnit.test('Require defined', function(assert) {
    assert.ok(typeof requirejs === 'function', 'Test requirejs');
    assert.ok(typeof require === 'function', 'Test require');
    assert.ok(typeof define === 'function', 'Test define');
  });

  QUnit.test('Require AMD supported', function(assert) {
    var done = assert.async();
    assert.expect(3);
    context.require(['../base/dist/interf'], function(interf) {
      assert.ok(typeof context.interf === 'undefined', 'Test interf defined not glogaly');
      assert.ok(typeof interf.create === 'function', 'Test interf.create defined');
      assert.ok(typeof interf.VERSION === 'number', 'Test interf.VERSION defined');

      done();
      return {};
    });
  });
})();
