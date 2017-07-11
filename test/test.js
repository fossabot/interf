const interf = require('../dist/interf');
const list = require('./tests-list');

// console.log(list.main.test, interf);

// list.main.test(interf);

Object.keys(list.main).forEach(key => list.main[key](interf));
