const Default = interf => {
  QUnit.module('interf._config.debug');

  const create = interf.create;
  const implement = interf.implement;
  const remove = interf.remove;
  const empty = interf.empty;
  const mix = interf.mix;
  const debug = interf.debug;

  QUnit.test('Test debug callback', assert => {
    const oldConfig = interf._config;

    interf.configure({
      debug: true,
      afterImplement: true,
      callbacks: {
        debug: function customDebug(data) {
          assert.strictEqual(this, interf._config.callbacks, 'correct this in debugCallback');
          assert.strictEqual(arguments.length, 1, 'correct arguments in debugCallback');
          assert.strictEqual(
            typeof data.operation,
            'string',
            'correct typeof data.operation in debugCallback'
          );
          assert.strictEqual(
            typeof data.success,
            'boolean',
            'correct typeof data.success in debugCallback'
          );
          assert.strictEqual(
            typeof data.message,
            'string',
            'correct typeof data.message in debugCallback'
          );
          assert.notStrictEqual(
            typeof data.value,
            'undefined',
            'correct typeof data.value in debugCallback'
          );
          assert.strictEqual(
            typeof data.Constructor,
            'function',
            'correct typeof data.Constructor in debugCallback'
          );
        },
      },
    });

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
      () => implement(I1, { name: 'none isInterfaceOf method' }).in(class C {}),
      'Wrong implement argument'
    );

    assert.strictEqual(remove(I5).in(C5), true, 'removed in');
    assert.strictEqual(remove(I1).in(C3), true, 'removed in');
    assert.strictEqual(remove(I5).in(C5), false, 'not removed in');
    assert.strictEqual(remove(I5).in(class C {}), false, 'not removed in');
    assert.strictEqual(empty().in(C3), true, 'empty in');
    assert.strictEqual(empty().in(C3), false, 'not empty in');
    assert.strictEqual(empty().in(class C {}), false, 'not empty in');

    const TM1 = implement(I1).in(
      class TestMixin1 {
        constructor() {
          this.TestMixin1Prop = null;
        }
        testMethod1() {
          return 'test Method 1 from TestMixin1';
        }

        testMethod2() {
          return 'test Method 2 from TestMixin1';
        }

        static staticMethod1() {
          return 'static Method 1 from TestMixin1';
        }
      }
    );

    const TM2 = implement(I2).in(
      class TestMixin2 {
        constructor() {
          this.TestMixin2Prop = 'test2';
        }
        testMethod1() {
          return 'test Method 1 from TestMixin2';
        }
      }
    );

    const TM3 = implement(I3).in(mix(TM1).in(class TestMixin3 {}));

    class SuperClass {
      constructor() {
        this.superProp = 0;
      }

      testMethod1() {
        return 'test Method 1 from SuperClass';
      }
    }

    class MainClass1 extends SuperClass {
      constructor(...args) {
        super();
        this.MainProp = 1;

        // or use "if (MixinsInitiable.isInterfaceOf(this))"
        if (this.initMixins) {
          const everyMixinConstructorArguments = [{ bla: 'bla' }, 'bla', ...args];
          this.initMixins(...everyMixinConstructorArguments);
        }
      }

      testMethod1() {
        return `${super.testMethod1()} test Method 1 from MainClass`;
      }
    }

    mix(TM1, TM2).in(MainClass1);
    mix(TM3).in(MainClass1);
    const mo1 = new MainClass1();
    assert.isInstance(mo1, I1);
    assert.isInstance(mo1, I2);
    assert.isInstance(mo1, I3);

    interf.configure(oldConfig);

    // check default debugCallback, not throw error
    try {
      assert.strictEqual(empty({ debug: true }).in(C3), false, 'not empty in');
    } catch (e) {
      assert.ok(false, 'unexpected error throwed with debug = true and default debugCallback');
    }

    assert.strictEqual(interf._config.debug, false, 'default debug === false');
  });

  QUnit.module('interf.debug');

  QUnit.test('Test debug method', assert => {
    const I1 = create('Name1');
    const I2 = create('Name2', [I1]);
    const I3 = create('Name3', [I1, I2]);
    const I4 = create({ name: 'Name4', extends: [I1, I3] });
    const I5 = create('Name5', [I2]);

    const C1 = implement(I1, I2).in(class C1 {});
    const C2 = implement(I1, I2, I3, I4, I5).in(class C2 extends C1 {});

    const all = [];
    all.push(debug().in(C2));
    all.push(debug(['duplicates', 'tree', 'list']).in(C2));
    all.push(debug(['ignoreParam', 'duplicates', 'tree', 'list']).in(C2));
    all.push(debug('all').in(C2));

    all.forEach(result => {
      assert.strictEqual(Array.isArray(result.list), true, 'debug all.list is array');
      assert.strictEqual(Array.isArray(result.tree), true, 'debug all.tree is array');
      assert.strictEqual(Array.isArray(result.duplicates), true, 'debug all.duplicates is array');
      assert.strictEqual(
        typeof result.ignoreParam,
        'undefined',
        'debug all.ignoreParam is undefined'
      );
    });

    const notAll = debug('duplicates', 'tree', 'list').in(C2);

    assert.strictEqual(typeof notAll.list, 'undefined', 'debug notAll.list is undefined');
    assert.strictEqual(typeof notAll.tree, 'undefined', 'debug notAll.tree is undefined');
    assert.strictEqual(Array.isArray(notAll.duplicates), true, 'debug notAll.duplicates is array');
    assert.throws(() => debug(I1).in(C1), 'Wrong debug argument');

    const duplicates = all[0].duplicates;
    const list = all[0].list;
    const tree = all[0].tree;

    assert.strictEqual(duplicates.length, 3, 'correct duplicates data length');
    assert.strictEqual(duplicates[0].interface, I1, 'correct duplicates data');
    assert.strictEqual(duplicates[0].implementedIn.length, 10, 'correct duplicates data');
    assert.strictEqual(duplicates[1].interface, I2, 'correct duplicates data');
    assert.strictEqual(duplicates[1].implementedIn.length, 5, 'correct duplicates data');
    assert.strictEqual(duplicates[2].interface, I3, 'correct duplicates data');
    assert.strictEqual(duplicates[2].implementedIn.length, 2, 'correct duplicates data');

    assert.strictEqual(list.length, 5, 'correct list data length');
    assert.strictEqual(list[0].interface, I1, 'correct list data');
    assert.strictEqual(list[0].implementedIn.length, 10, 'correct list data');
    assert.strictEqual(list[1].interface, I2, 'correct list data');
    assert.strictEqual(list[1].implementedIn.length, 5, 'correct list data');
    assert.strictEqual(list[2].interface, I3, 'correct list data');
    assert.strictEqual(list[2].implementedIn.length, 2, 'correct list data');
    assert.strictEqual(list[3].interface, I4, 'correct list data');
    assert.strictEqual(list[3].implementedIn.length, 1, 'correct list data');
    assert.strictEqual(list[4].interface, I5, 'correct list data');
    assert.strictEqual(list[4].implementedIn.length, 1, 'correct list data');

    assert.strictEqual(tree.length, 2, 'correct tree data length');
    assert.strictEqual(tree[0].interfaces.length, 2, 'correct tree data');
    assert.strictEqual(tree[0].proto, C1.prototype, 'correct tree data');
    assert.strictEqual(tree[1].interfaces.length, 5, 'correct tree data');
    assert.strictEqual(tree[1].proto, C2.prototype, 'correct tree data');
  });
};

// export default Default;

// define([], { default: Default });

module.exports = { default: Default };
