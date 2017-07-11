(function() {
  QUnit.module('Tests loading of interf in global scope');

  var context = window || global || self;

  QUnit.test('Require global supported', function(assert) {
    assert.ok(typeof context.interf === 'object', 'Test interf defined glogaly');
    assert.ok(typeof context.interf.create === 'function', 'Test interf.create defined');
    assert.ok(typeof context.interf.VERSION === 'number', 'Test interf.VERSION defined');
  });
})();
