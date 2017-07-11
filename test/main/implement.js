const Default = interf => {
  QUnit.module('interf.implement');

  const create = interf.create;
  const implement = interf.implement;

  QUnit.test('Test implement', assert => {
    const I1 = create('Name1');
    const I2 = create('Name2', [I1]);
    const I3 = create('Name3', [I1, I2]);
    const I4 = create({ name: 'Name4', extends: [I1, I3] });
    const I5 = create('Name5', [I2]);

    const C1 = implement(I1).in(class C1 {});
    const C2 = implement(I2).in(class C2 extends C1 {});
    const C3 = implement(I1, I2, I3).in(class C3 {});
    const C4 = implement(I4).in(implement([I1, I2, I3]).in(class C4 {}));
    const C5 = implement([I5]).in(class C5 {});
    const o1 = new C1();
    const o2 = new C2();
    const o3 = new C3();
    const o4 = new C4();
    const o5 = new C5();
    assert.isInstance(o1, I1);
    assert.notInstance(o1, I2);
    assert.notInstance(o1, I3);
    assert.notInstance(o1, I4);
    assert.isInstance(o2, I1);
    assert.isInstance(o2, I2);
    assert.isInstance(o3, I1);
    assert.isInstance(o3, I2);
    assert.isInstance(o3, I3);
    assert.isInstance(o4, I1);
    assert.isInstance(o4, I2);
    assert.isInstance(o4, I3);
    assert.isInstance(o4, I4);
    assert.isInstance(o5, I1);
    assert.isInstance(o5, I2);
    assert.isInstance(o5, I5);
    assert.notInstance(o5, I3);
    assert.notInstance(o5, I4);

    assert.throws(() => implement(I1, I1).in(class C {}), 'Wrong implement argument');
    assert.throws(
      () => implement(I1, () => 'none isInterfaceOf method').in(class C {}),
      'Wrong implement argument (type)'
    );
    assert.throws(
      () => implement(I1, { name: 'none isInterfaceOf method' }).in(class C {}),
      'Wrong implement argument (invalid object)'
    );
  });

  QUnit.test('Test implement callbacks', assert => {
    assert.expect(5);

    const oldConfig = interf._config;

    const I1 = create('Name1');

    // test afterImplement

    interf.configure({
      afterImplement: true,
      callbacks: {
        afterImplement: function customSfterImplement(Interfaces, Class, interfacesCollection) {
          assert.strictEqual(
            this,
            interf._config.callbacks,
            'correct this in callback afterImplement'
          );
          assert.strictEqual(arguments.length, 3, 'correct arguments in callback afterImplement');
          assert.strictEqual(
            typeof Interfaces,
            'object',
            'correct Interfaces in callback afterImplement'
          );
          assert.strictEqual(typeof Class, 'function', 'correct Class in callback afterImplement');
          assert.strictEqual(
            interfacesCollection.length,
            1,
            'correct interfacesCollection in callback afterImplement'
          );
        },
      },
    });

    implement(I1).in(class AfterImplementClass {});

    interf.configure(oldConfig);
  });
};

// export default Default;

// define([], { default: Default });

module.exports = { default: Default };
