const Default = interf => {
  QUnit.module('interf.remove');

  const create = interf.create;
  const implement = interf.implement;
  const remove = interf.remove;

  QUnit.test('Test remove', assert => {
    const I1 = create('Name1');
    const I2 = create('Name2', [I1]);

    const C1 = implement(I1).in(class C1 {});
    const C2 = implement(I2).in(class C2 extends C1 {});
    const o1 = new C1();
    const o2 = new C2();

    assert.ok(remove(I2).in(C2), 'remove ok');
    assert.isInstance(o2, I1); // parent has
    assert.notInstance(o2, I2);

    assert.ok(remove(I1).in(C1), 'remove ok');
    assert.notOk(remove(I2).in(C1), 'remove not ok');
    assert.notInstance(o1, I1);

    assert.notInstance(o2, I1); // parent has not

    assert.strictEqual(
      remove(I1, I1).in(class C {}),
      false,
      'Valid remove argument return false, none error'
    );

    assert.throws(
      () => remove(I1, { name: 'none isInterfaceOf method' }).in(class C {}),
      'Wrong remove argument'
    );
  });

  QUnit.test('Test warn callback', assert => {
    assert.expect(9);

    const oldConfig = interf._config;

    const I1 = create('Name1');
    const I2 = create('Name2', [I1]);

    const C1 = implement(I1).in(class C1 {});
    const C2 = implement(I2, I1).in(class C2 extends C1 {});

    interf.configure({
      warn: true,
      callbacks: {
        warn: function customWarn(data) {
          assert.strictEqual(this, interf._config.callbacks, 'correct this in warnCallback');
          assert.strictEqual(arguments.length, 1, 'correct arguments in warnCallback');
          assert.strictEqual(typeof data, 'object', 'data is object in warnCallback');
          assert.strictEqual(
            typeof data.message,
            'string',
            'data.message is string in warnCallback'
          );
        },
      },
    });

    remove(I1).in(C2);
    remove(I1).in(C2);
    remove([I1], { warn: false }).in(C2);
    assert.strictEqual(interf._config.warn, true, '_config.warn not changed');

    interf.configure(oldConfig);
  });
};

// export default Default;

// define([], { default: Default });

module.exports = { default: Default };
