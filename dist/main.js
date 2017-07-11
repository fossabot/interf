// import interf from './interf';
var interf = require('./interf');

var Sellable = interf.create({ name: 'Sellable' });

var Crewable = interf.create('Crewable');

var Flyable = interf.create('Flyable');

var Living = interf.create('Living');

var Speakable = interf.create('Speakable');

// interface Quackable extends Living, Speakable
var Quackable = interf.create('Quackable', [Living, Speakable]);

// interface Swimming extends Living
var Swimming = interf.create('Swimming', [Living]);

var Walking = interf.create('Walking');

var Thing = function Thing () {};
var Plane = interf.implement(Sellable).in(interf.implement(Flyable).in(interf.implement(Crewable).in((function (Thing) {
  function Plane(price) {
    Thing.call(this);
    this.price = price;
    this.crew = [];
    this.fuel = 0;
  }

  if ( Thing ) Plane.__proto__ = Thing;
  Plane.prototype = Object.create( Thing && Thing.prototype );
  Plane.prototype.constructor = Plane;

  Plane.prototype.fly = function fly () {
    if (this.fuel > 0) return 'Flying!';
    return false;
  };

  return Plane;
}(Thing)))));
var Animal = function Animal() {
  this.animalProp = 0;
};
var Duck = interf.implement(Living, Quackable, Swimming, Flyable, Sellable).in((function (Animal) {
  function Duck () {
    Animal.apply(this, arguments);
  }if ( Animal ) Duck.__proto__ = Animal;
  Duck.prototype = Object.create( Animal && Animal.prototype );
  Duck.prototype.constructor = Duck;

  

  return Duck;
}(Animal)));

var RedHeadDuck = (function (Duck) {
  function RedHeadDuck () {
    Duck.apply(this, arguments);
  }

  if ( Duck ) RedHeadDuck.__proto__ = Duck;
  RedHeadDuck.prototype = Object.create( Duck && Duck.prototype );
  RedHeadDuck.prototype.constructor = RedHeadDuck;

  RedHeadDuck.prototype.instanceOf = function instanceOf (Constructor) {
    return Duck.prototype.instanceOf.call(this, Constructor);
  };

  return RedHeadDuck;
}(Duck));

RedHeadDuck.static = function () {
  return 'static';
};
var QuackableRedHeadDuck = interf.implement([Quackable, Walking]).in((function (RedHeadDuck) {
  function QuackableRedHeadDuck () {
    RedHeadDuck.apply(this, arguments);
  }if ( RedHeadDuck ) QuackableRedHeadDuck.__proto__ = RedHeadDuck;
  QuackableRedHeadDuck.prototype = Object.create( RedHeadDuck && RedHeadDuck.prototype );
  QuackableRedHeadDuck.prototype.constructor = QuackableRedHeadDuck;

  

  return QuackableRedHeadDuck;
}(RedHeadDuck)));

var TESTS = 1;

function warn() {
  var _console;

  (_console = console).warn.apply(_console, arguments);
}

function log() {
  var _console2;

  (_console2 = console).log.apply(_console2, arguments);
}
function logInst(obj, Constructor, expected) {
  // const result = obj.instanceOf(Constructor);
  var result = typeof Constructor.isInterfaceOf === 'function' && Constructor.isInterfaceOf(obj) || typeof Constructor === 'function' && obj instanceof Constructor;
  if (result !== expected) {
    warn('Instance fail', obj.constructor.name, Constructor.name, result, expected);
  }
}

var mrija = new Plane(200000);
var donald = new Duck();
var mike = new RedHeadDuck();
var arnold = new QuackableRedHeadDuck();
window.interf = interf;
window.a = arnold;
window.b = QuackableRedHeadDuck;
window.c = mike;
log('start TESTS');
var startMrija = Date.now();
for (var i = 0; i < TESTS; i += 1) {
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
var resMrija = Date.now() - startMrija;
log('mrija duration', resMrija);

var startDonald = Date.now();
for (var _i = 0; _i < TESTS; _i += 1) {
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
var resDonald = Date.now() - startDonald;
log('donald duration', resDonald);

var startMike = Date.now();
for (var _i2 = 0; _i2 < TESTS; _i2 += 1) {
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
var resMike = Date.now() - startMike;
log('mike duration', resMike);

var startArnold = Date.now();
for (var _i3 = 0; _i3 < TESTS; _i3 += 1) {
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
var resArnold = Date.now() - startArnold;
log('arnold duration', resArnold);
var sum = resMrija + resDonald + resMike + resArnold;
var avg = sum / TESTS / 48;
log('sum', sum, 'avg', avg, 'TESTS', TESTS);
// // const nodee = document.createElement('LI');
// // const textnode = document.createTextNode(`sum ${sum}, avg ${avg}`);
// // nodee.appendChild(textnode);
// // // console.log(document.getElementById('list'));
// // document.getElementById('list').appendChild(nodee);

log('Main ready!');
//# sourceMappingURL=main.js.map
