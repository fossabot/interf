const Default = interf => {
  QUnit.module('interf.empty');

  const create = interf.create;
  const implement = interf.implement;
  const empty = interf.empty;

  QUnit.test('Test empty', assert => {
    const I1 = create('Name1');
    const I2 = create('Name2', [I1]);

    const C1 = implement(I1).in(class C1 {});
    const C2 = implement(I2).in(class C2 extends C1 {});
    const o1 = new C1();
    const o2 = new C2();

    assert.ok(empty().in(C2), 'empty ok');
    assert.isInstance(o2, I1); // parent has
    assert.notInstance(o2, I2);

    assert.ok(empty().in(C1), 'empty ok');
    assert.notOk(empty({ test: 1 }).in(C1), 'empty not ok');
    assert.notInstance(o1, I1);

    assert.notInstance(o2, I1); // parent has not

    assert.notOk(empty().in(class C {}), 'empty not ok');
  });
};

// export default Default;

// define([], { default: Default });

module.exports = { default: Default };
