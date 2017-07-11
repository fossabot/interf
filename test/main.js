// import interf from './interf';
const interf = require('../src/interf');

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
}
const Duck = interf
  .implement(Living, Quackable, Swimming, Flyable, Sellable)
  .in(class Duck extends Animal {});

class RedHeadDuck extends Duck {
  instanceOf(Constructor) {
    return super.instanceOf(Constructor);
  }
}

RedHeadDuck.static = () => 'static';
const QuackableRedHeadDuck = interf
  .implement([Quackable, Walking])
  .in(class QuackableRedHeadDuck extends RedHeadDuck {});

const TESTS = 1;

function warn(...args) {
  console.warn(...args);
}

function log(...args) {
  console.log(...args);
}
function logInst(obj, Constructor, expected) {
  // const result = obj.instanceOf(Constructor);
  const result =
    (typeof Constructor.isInterfaceOf === 'function' && Constructor.isInterfaceOf(obj)) ||
    (typeof Constructor === 'function' && obj instanceof Constructor);
  if (result !== expected) {
    warn('Instance fail', obj.constructor.name, Constructor.name, result, expected);
  }
}

const mrija = new Plane(200000);
const donald = new Duck();
const mike = new RedHeadDuck();
const arnold = new QuackableRedHeadDuck();
window.interf = interf;
window.a = arnold;
window.b = QuackableRedHeadDuck;
window.c = mike;
log('start TESTS');
const startMrija = Date.now();
for (let i = 0; i < TESTS; i += 1) {
  logInst(mrija, Sellable, true);
  logInst(mrija, Flyable, true);
  logInst(mrija, Crewable, true);
  logInst(mrija, Living, false);
  logInst(mrija, Speakable, false);
  logInst(mrija, Quackable, false);
  logInst(mrija, Swimming, false);
  logInst(mrija, Animal, false);
  logInst(mrija, Plane, true);
  logInst(mrija, Duck, false);
  logInst(mrija, Thing, true);
  logInst(mrija, Object, true);
}
const resMrija = Date.now() - startMrija;
log('mrija duration', resMrija);

const startDonald = Date.now();
for (let i = 0; i < TESTS; i += 1) {
  logInst(donald, Sellable, true);
  logInst(donald, Flyable, true);
  logInst(donald, Crewable, false);
  logInst(donald, Living, true);
  logInst(donald, Speakable, true);
  logInst(donald, Quackable, true);
  logInst(donald, Swimming, true);
  logInst(donald, Animal, true);
  logInst(donald, Plane, false);
  logInst(donald, Duck, true);
  logInst(donald, Thing, false);
  logInst(donald, Object, true);
}
const resDonald = Date.now() - startDonald;
log('donald duration', resDonald);

const startMike = Date.now();
for (let i = 0; i < TESTS; i += 1) {
  logInst(mike, QuackableRedHeadDuck, false);
  logInst(mike, RedHeadDuck, true);
  logInst(mike, Crewable, false);
  logInst(mike, Living, true);
  logInst(mike, Speakable, true);
  logInst(mike, Quackable, true);
  logInst(mike, Walking, false);
  logInst(mike, Animal, true);
  logInst(mike, Plane, false);
  logInst(mike, Duck, true);
  logInst(mike, Thing, false);
  logInst(mike, Object, true);
}
const resMike = Date.now() - startMike;
log('mike duration', resMike);

const startArnold = Date.now();
for (let i = 0; i < TESTS; i += 1) {
  logInst(arnold, QuackableRedHeadDuck, true);
  logInst(arnold, Walking, true);
  logInst(arnold, Crewable, false);
  logInst(arnold, Living, true);
  logInst(arnold, Speakable, true);
  logInst(arnold, Quackable, true);
  logInst(arnold, Swimming, true);
  logInst(arnold, Animal, true);
  logInst(arnold, Plane, false);
  logInst(arnold, Duck, true);
  logInst(arnold, Thing, false);
  logInst(arnold, Object, true);
}
const resArnold = Date.now() - startArnold;
log('arnold duration', resArnold);
const sum = resMrija + resDonald + resMike + resArnold;
const avg = sum / TESTS / 48;
log('sum', sum, 'avg', avg, 'TESTS', TESTS);

log('Main ready!');
