const Default = interf => {
  QUnit.module('interf.SOME_METHOD().in');

  const create = interf.create;
  const implement = interf.implement;

  QUnit.test('Test in argument', assert => {
    const I1 = create('Name1');
    const I2 = create('Name2');
    const I3 = create('Name3');
    const C1 = class C1 {};

    assert.strictEqual(implement(I1).in(C1), C1, 'class in ok');
    assert.strictEqual(implement(I2).in(C1.prototype), C1, 'class prototype in ok');
    assert.throws(() => implement(I3).in({}), 'Wrong in parameter');
  });
};

// export default Default;

// define([], { default: Default });

module.exports = { default: Default };
