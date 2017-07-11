const Default = interf => {
  QUnit.module('Utils');

  const utils = interf.utils;

  QUnit.test('Test getProto', assert => {
    class C {}
    const o = new C();
    const proto = utils.getProto(o);

    assert.strictEqual(proto, C.prototype, 'Correct getProto result C.prototype');
	if (o.__proto__) {
		assert.strictEqual(proto, o.__proto__, 'Correct getProto result o.__proto__');
	}
    assert.strictEqual(utils.getProto(proto), Object.prototype, 'Correct getProto result Object.prototype');
  });

  QUnit.test('Test getSymbols', assert => {
    class SymbClass {} // test with class, it is like static property

    if (Object.getOwnPropertySymbols) {
      const symb = Symbol('test symbol');
      SymbClass[symb] = 'anyValue';
      const keys = utils.getSymbols(SymbClass);

      assert.strictEqual(keys.length, 1, 'Symbol supported, correct keys.length === 1');
      assert.strictEqual(symb, keys[0], 'Symbol supported, correct Symbol');
    } else {
      const keys = utils.getSymbols(SymbClass);
      assert.strictEqual(keys.length, 0, 'Symbol not supported, correct keys.length === 0');
    }
  });

  QUnit.test('Test addArray', assert => {
    const base = [0];
    const array = [{}, 2, 'str'];
    array[999] = null;
    array[1999] = undefined;
    const result = utils.addArray(base, array);

    assert.strictEqual(result, base, 'addArray return correct');
    assert.strictEqual(result.length, 2001, 'addArray length correct');
    assert.strictEqual(result[0], 0, 'addArray array 0 element correct');
    assert.deepEqual(result[1], {}, 'addArray array 1 element correct');
    assert.strictEqual(result[2], 2, 'addArray array 2 element correct');
    assert.strictEqual(result[3], 'str', 'addArray array 3 element correct');
    assert.strictEqual(result[999], undefined, 'addArray array 999 element correct');
    assert.strictEqual(result[1000], null, 'addArray array 1000 element correct');
    assert.strictEqual(result[2000], undefined, 'addArray array 2000 element correct');
  });

  QUnit.test('Test mergeObjects', assert => {
    const target = {
      rewrite: 1,
      array: [0],
      subObj: {
        subProp1: 1,
      },
      prop1: 1,
    };
    const source = {
      rewrite: 2,
      array: [1],
      subObj: {
        subProp2: 2,
      },
      prop2: 2,
    };
    const result = utils.mergeObjects(target, source);

    assert.ok(result === target, 'mergeObjects return correct');
    assert.strictEqual(result.rewrite, 2, 'result property rewrite correct');
    assert.strictEqual(result.prop1, 1, 'result property prop1 correct');
    assert.strictEqual(result.prop2, 2, 'result property prop2 correct');
    assert.strictEqual(result.array.length, 2, 'result property array correct');
    assert.strictEqual(result.array[0], 0, 'result property array correct');
    assert.strictEqual(result.array[1], 1, 'result property array correct');
    assert.strictEqual(result.subObj.subProp1, 1, 'result property subObj.subProp1 correct');
    assert.strictEqual(result.subObj.subProp2, 2, 'result property subObj.subProp2 correct');
  });

  QUnit.test('Test assignObjects', assert => {
    const base = {
      rewrite: 1,
      array: [0],
      subObj: {
        subProp1: 1,
      },
      prop1: 1,
    };
    const obj = {
      rewrite: 2,
      array: [1],
      subObj: {
        subProp2: 2,
      },
      prop2: 2,
    };
    const result = utils.assignObjects(base, obj);

    assert.notEqual(result, base, 'assignObjects return correct');
    assert.strictEqual(result.rewrite, 2, 'result property rewrite correct');
    assert.strictEqual(result.prop1, 1, 'result property prop1 correct');
    assert.strictEqual(result.prop2, 2, 'result property prop2 correct');
    assert.strictEqual(result.array.length, 2, 'result property array correct');
    assert.strictEqual(result.array[0], 0, 'result property array correct');
    assert.strictEqual(result.array[1], 1, 'result property array correct');
    assert.strictEqual(result.subObj.subProp1, 1, 'result property subObj.subProp1 correct');
    assert.strictEqual(result.subObj.subProp2, 2, 'result property subObj.subProp2 correct');
  });
};

// export default Default;

// define([], { default: Default });

module.exports = { default: Default };
