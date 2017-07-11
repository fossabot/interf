const Default = interf => {
  QUnit.module('interf.mix');

  const mix = interf.mix;
  const create = interf.create;
  const implement = interf.implement;

  QUnit.test('Test mix', assert => {
    const I1 = create('Name1');
    const I2 = create('Name2');

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

    // The second class to be used as a mixin
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

    class MainClass2 extends SuperClass {
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

    class MainClass3 extends SuperClass {}
    Object.defineProperty(MainClass3, 'staticMethod1', { value: null });

    class MainClass4 extends SuperClass {}
    Object.defineProperty(MainClass4, 'staticMethod1', { value: null });

    class MainClass5 extends SuperClass {}
    Object.defineProperty(MainClass5, 'staticMethod1', {
      value: null,
      writable: true,
    });

    mix(TM1, TM2).in(MainClass1);
    mix([TM1, TM2], { debug: true, replace: false, createInit: false, interfaces: false }).in(
      MainClass2
    );
    const mo1 = new MainClass1();
    const mo2 = new MainClass2();
    MainClass1.staticMethod1();

    assert.strictEqual(
      mo1.testMethod1(),
      'test Method 1 from TestMixin2',
      'Method1 from TestMixin2'
    );
    assert.strictEqual(
      mo1.testMethod2(),
      'test Method 2 from TestMixin1',
      'Method2 from TestMixin1'
    );
    assert.strictEqual(
      MainClass1.staticMethod1(),
      'static Method 1 from TestMixin1',
      'staticMethod1 from TestMixin1'
    );
    assert.strictEqual(mo1.superProp, 0, 'superProp from SuperClass');
    assert.strictEqual(mo1.MainProp, 1, 'MainProp from MainClass');
    assert.strictEqual(mo1.TestMixin1Prop, null, 'TestMixin1Prop from TestMixin1');
    assert.strictEqual(mo1.TestMixin2Prop, 'test2', 'TestMixin2Prop from TestMixin2');
    assert.isInstance(mo1, I1);
    assert.isInstance(mo1, I2);

    assert.strictEqual(
      mo2.testMethod1(),
      'test Method 1 from SuperClass test Method 1 from MainClass',
      'Method1 from SuperClass and MainClass'
    );
    assert.strictEqual(
      mo2.testMethod2(),
      'test Method 2 from TestMixin1',
      'Method2 from TestMixin1'
    );
    assert.strictEqual(
      MainClass2.staticMethod1(),
      'static Method 1 from TestMixin1',
      'staticMethod1 from TestMixin1'
    );
    assert.strictEqual(mo2.superProp, 0, 'superProp from SuperClass');
    assert.strictEqual(mo2.MainProp, 1, 'MainProp from MainClass');
    assert.strictEqual(mo2.TestMixin1Prop, undefined, 'undefined TestMixin1Prop from TestMixin1');
    assert.strictEqual(mo2.TestMixin2Prop, undefined, 'undefined TestMixin2Prop from TestMixin2');
    assert.notInstance(mo2, I1);
    assert.notInstance(mo2, I2);

    assert.throws(
      () => mix(TM1, TM2).in(MainClass3),
      'Mix notConfigurableNotWritable property error'
    );

    try {
      mix([TM1, TM2], {
        replace: true,
        notConfigurableNotWritableError: false,
        debug: true,
      }).in(MainClass4);
      const mo4 = new MainClass4();
      assert.isInstance(mo4, I1);
      assert.isInstance(mo4, I2);
    } catch (e) {
      assert.ok(
        false,
        'unexpected error throwed with { notConfigurableNotWritableError: false }'
      );
    }

    mix([TM1, TM2], { debug: true }).in(MainClass5);
    assert.strictEqual(
      MainClass5.staticMethod1(),
      'static Method 1 from TestMixin1',
      'staticMethod1 from TestMixin1'
    );
  });

  QUnit.test('Check MixinsInitiable interface', assert => {
    class TestMixin1 {}
    class MainClass1 {}
    mix(TestMixin1).in(MainClass1);
    const mo1 = new MainClass1();

    assert.ok(interf.interfaces.MixinsInitiable, 'MixinsInitiable exist');
    assert.isInstance(mo1, interf.interfaces.MixinsInitiable);
  });

  QUnit.test('Test implement callbacks', assert => {
    assert.ok(true);
  });
};

// export default Default;

// define([], { default: Default });

module.exports = { default: Default };
