const Default = interf => {
  QUnit.module('interf.create');

  const create = interf.create;

  QUnit.test('Test create', assert => {
    const I1 = create('Name1');
    const I2 = create('Name2', [I1]);
    const I3 = create('Name3', [I1, I2]);
    const I4 = create({ name: 'Name4', extends: [I1] });

    assert.strictEqual(I1.name, 'Name1', 'correct name');
    assert.strictEqual(I2.name, 'Name2', 'correct name');
    assert.strictEqual(I3.name, 'Name3', 'correct name');
    assert.strictEqual(I4.name, 'Name4', 'correct name');

    assert.strictEqual(I2.extends[0], I1, 'correct extends');
    assert.strictEqual(I3.extends[0], I1, 'correct extends');
    assert.strictEqual(I3.extends[1], I2, 'correct extends');
    assert.strictEqual(I4.extends[0], I1, 'correct extends');

    assert.throws(() => create(1), 'Wrong create argument');
    assert.throws(() => create(''), 'Wrong create argument');
    assert.throws(() => create('Name', I1), 'Wrong create argument');
    assert.throws(() => create({ NaMe: 'Wrong' }), 'Wrong create argument');
    assert.throws(() => create({ name: 'Name', extends: 1 }), 'Wrong create argument');
    assert.throws(
      () => create({ name: 'Name', extends: [I1], lowerCase: 'Wrong' }),
      'Wrong create argument'
    );
  });
};

// export default Default;

// define([], { default: Default });

module.exports = { default: Default };
