const Default = interf => {
  const Sellable = interf.create({ name: 'Sellable' });

  const Living = interf.create('Living');

  const Swimming = interf.create('Swimming', [Living]);

  const Walking = interf.create('Walking');

  const myCollection = [];

  QUnit.module('Descriptor');

  QUnit.test('correct descriptor', assert => {
    const defaultDescriptor = interf._config.descriptor;

    interf.configure({
      descriptor: {
        set: function(value) {
          myCollection.push(value);
          this.myCollectionId = myCollection.length - 1;
        },
        get: function() {
          return myCollection[this.myCollectionId];
        },
        enumerable: true,
        configurable: true,
      },
    });

    const Test = interf
      .implement([Sellable, Walking, Swimming], { debug: false })
      .in(class Test {});
    const t = new Test();

    assert.equal(1, myCollection.length, 'myCollection has correct length');

    const proto = Object.getPrototypeOf(t);
    const prop = Object.getOwnPropertyDescriptor(proto.constructor, '__interfaces_');
    assert.deepEqual(
      prop,
      interf._config.descriptor,
      'descriptor are correct, or was chnged correct'
    );

    interf.configure({
      descriptor: defaultDescriptor,
    });
  });
};

// export default Default;

// define([], { default: Default });

module.exports = { default: Default };
