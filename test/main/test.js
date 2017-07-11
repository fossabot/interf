const Default = interf => {
  const Sellable = interf.create({ name: 'Sellable' });

  const Crewable = interf.create('Crewable');

  const Flyable = interf.create('Flyable');

  const Living = interf.create('Living');

  const Speakable = interf.create('Speakable');

  // interface Quackable extends Living, Speakable
  const Quackable = interf.create('Quackable', [Living, Speakable]);

  // interface Swimming extends Living
  const Swimming = interf.create('Swimming', [Living]);

  const Walking = interf.create('Walking');

  class Thing {}

  const Plane = interf.implement(Sellable).in(
    interf.implement(Flyable).in(
      interf.implement(Crewable).in(
        class Plane extends Thing {
          constructor(price) {
            super();
            this.price = price;
            this.crew = [];
            this.fuel = 0;
          }

          fly() {
            if (this.fuel > 0) return 'Flying!';
            return false;
          }
        }
      )
    )
  );

  class Animal {
    constructor() {
      this.animalProp = 0;
    }

    animalMethod() {}
  }

  const Duck = interf
    .implement(Living, Quackable, Swimming, Flyable, Sellable)
    .in(class Duck extends Animal {});

  class RedHeadDuck extends Duck {
    instanceOf(Constructor) {
      return super.instanceOf(Constructor);
    }
    RedHeadDuckMethod() {
      return 'RedHeadDuckMethod';
    }
  }
  const QuackableRedHeadDuck = interf
    .implement([Quackable, Walking])
    .in(class QuackableRedHeadDuck extends RedHeadDuck {});

  QUnit.module('Implement works');

  QUnit.test('Test class', assert => {
    const Test = interf
      .implement([Sellable, Crewable, Flyable], { debug: false })
      .in(class Test {});
    const t = new Test();

    assert.ok(t instanceof Test, 'Test object created');
  });

  QUnit.module('Right Instances');

  QUnit.assert.isInstance = function(obj, Const) {
    const actual =
      (typeof Const.isInterfaceOf === 'function' && Const.isInterfaceOf(obj)) ||
      (typeof Const === 'function' && obj instanceof Const);
    this.pushResult({
      result: actual,
      actual,
      expected: obj,
      message: `Object of ${Object.getPrototypeOf(obj).constructor
        .name} is instance of ${Const.name}`,
    });
  };

  QUnit.assert.notInstance = function(obj, Const) {
    const actual =
      (typeof Const.isInterfaceOf === 'function' && Const.isInterfaceOf(obj)) ||
      (typeof Const === 'function' && obj instanceof Const);
    this.pushResult({
      result: !actual,
      actual,
      expected: obj,
      message: `Object of ${Object.getPrototypeOf(obj).constructor
        .name} is not instance of ${Const.name}`,
    });
  };

  QUnit.test('Plane class', assert => {
    const mrija = new Plane(200000);

    assert.isInstance(mrija, Sellable);
    assert.isInstance(mrija, Flyable);
    assert.isInstance(mrija, Crewable);
    assert.notInstance(mrija, Living);
    assert.notInstance(mrija, Speakable);
    assert.notInstance(mrija, Quackable);
    assert.notInstance(mrija, Swimming);
    assert.notInstance(mrija, Animal);
    assert.isInstance(mrija, Plane);
    assert.notInstance(mrija, Duck);
    assert.isInstance(mrija, Thing);
    assert.isInstance(mrija, Object);

    assert.ok(
      Object.keys(mrija).indexOf('__interfaces_') === -1,
      'obj.__interfaces_ is not enumerable'
    );

    mrija.__interfaces_ = 'writable';
    assert.ok(mrija.__interfaces_ === 'writable', 'obj.__interfaces_ is writable');

    Object.defineProperty(mrija, '__interfaces_', {
      writable: true,
      configurable: true,
      value: 'configurable',
    });
    assert.ok(typeof mrija.__interfaces_ === 'string', 'obj.__interfaces_ is configurable');

    assert.isInstance(mrija, Sellable);
    assert.isInstance(mrija, Flyable);
    assert.isInstance(mrija, Crewable);
    assert.notInstance(mrija, Living);
    assert.notInstance(mrija, Speakable);
    assert.notInstance(mrija, Quackable);
    assert.notInstance(mrija, Swimming);
    assert.notInstance(mrija, Animal);
    assert.isInstance(mrija, Plane);
    assert.notInstance(mrija, Duck);
    assert.isInstance(mrija, Thing);
    assert.isInstance(mrija, Object);

    assert.ok(
      Object.keys(Plane).indexOf('__interfaces_') === -1,
      'constructor.__interfaces_ is not enumerable'
    );

    assert.throws(() => {
      const str = 'wrong writable';
      Plane.__interfaces_ = str;
      if (Plane.__interfaces_ !== str) {
        throw Error('Ok, constructor.__interfaces_ is not writable');
      }
    }, 'constructor.__interfaces_ is not writable, error');
    assert.ok(typeof Plane.__interfaces_ === 'object', 'constructor.__interfaces_ is not writable, test');

    assert.ok(
      Object.defineProperty(Plane, '__interfaces_', {
        configurable: true,
        value: Plane.__interfaces_,
      }) === Plane,
      'constructor.__interfaces_ is configurable'
    );

    assert.isInstance(mrija, Sellable);
    assert.isInstance(mrija, Flyable);
    assert.isInstance(mrija, Crewable);
    assert.notInstance(mrija, Living);
    assert.notInstance(mrija, Speakable);
    assert.notInstance(mrija, Quackable);
    assert.notInstance(mrija, Swimming);
    assert.notInstance(mrija, Animal);
    assert.isInstance(mrija, Plane);
    assert.notInstance(mrija, Duck);
    assert.isInstance(mrija, Thing);
    assert.isInstance(mrija, Object);
  });

  QUnit.test('Duck class', assert => {
    const donald = new Duck();

    assert.isInstance(donald, Sellable);
    assert.isInstance(donald, Flyable);
    assert.notInstance(donald, Crewable);
    assert.isInstance(donald, Living);
    assert.isInstance(donald, Speakable);
    assert.isInstance(donald, Quackable);
    assert.isInstance(donald, Swimming);
    assert.isInstance(donald, Animal);
    assert.notInstance(donald, Plane);
    assert.isInstance(donald, Duck);
    assert.notInstance(donald, Thing);
    assert.isInstance(donald, Object);
  });

  QUnit.test('RedHeadDuck class', assert => {
    const mike = new RedHeadDuck();

    assert.notInstance(mike, QuackableRedHeadDuck);
    assert.isInstance(mike, RedHeadDuck);
    assert.notInstance(mike, Crewable);
    assert.isInstance(mike, Living);
    assert.isInstance(mike, Speakable);
    assert.isInstance(mike, Quackable);
    assert.isInstance(mike, Swimming);
    assert.isInstance(mike, Animal);
    assert.notInstance(mike, Plane);
    assert.isInstance(mike, Duck);
    assert.notInstance(mike, Thing);
    assert.isInstance(mike, Object);
  });

  QUnit.test('QuackableRedHeadDuck class', assert => {
    const arnold = new QuackableRedHeadDuck();

    assert.isInstance(arnold, QuackableRedHeadDuck);
    assert.isInstance(arnold, Walking);
    assert.notInstance(arnold, Crewable);
    assert.isInstance(arnold, Living);
    assert.isInstance(arnold, Speakable);
    assert.isInstance(arnold, Quackable);
    assert.isInstance(arnold, Swimming);
    assert.isInstance(arnold, Animal);
    assert.notInstance(arnold, Plane);
    assert.isInstance(arnold, Duck);
    assert.notInstance(arnold, Thing);
    assert.isInstance(arnold, Object);
  });

  QUnit.module('Interf dynamic implementation');

  class SuperClass {}

  const Interface1 = interf.create('Interface1');
  const Interface2 = interf.create('Interface2');

  const SubClass1 = interf.implement().in(class SubClass1 extends SuperClass {});

  class SubClass2 extends SuperClass {}

  const subClaas1Obj = new SubClass1();
  const subClaas2Obj = new SubClass2();

  QUnit.test('Check subClasses objects interfaces', assert => {
    assert.notInstance(subClaas1Obj, Interface1);
    assert.notInstance(subClaas2Obj, Interface1);
    assert.notInstance(subClaas1Obj, Interface2);
    assert.notInstance(subClaas2Obj, Interface2);

    interf.implement(Interface1).in(SuperClass);
    interf.implement(Interface2).in(SubClass2);

    assert.isInstance(subClaas1Obj, Interface1);
    assert.isInstance(subClaas2Obj, Interface1);
    assert.notInstance(subClaas1Obj, Interface2);
    assert.isInstance(subClaas2Obj, Interface2);
  });
};

// export default Default;

// define([], { default: Default });

module.exports = { default: Default };
