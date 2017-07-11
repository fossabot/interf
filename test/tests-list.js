// import test from './main/test';
// import utils from './main/utils';
// import create from './main/create';
// import implement from './main/implement';
// import remove from './main/remove';
// import empty from './main/empty';
// import In from './main/in';
// import descriptor from './main/descriptor';

// import debug from './main/debug';
// import mix from './main/mix';

const test = require('./main/test').default;
const utils = require('./main/utils').default;
const create = require('./main/create').default;
const implement = require('./main/implement').default;
const remove = require('./main/remove').default;
const empty = require('./main/empty').default;
const In = require('./main/in').default;
const descriptor = require('./main/descriptor').default;

const debug = require('./main/debug').default;
const mix = require('./main/mix').default;

const mainCore = {
  test,
  utils,
  create,
  implement,
  remove,
  empty,
  in: In,
  descriptor,
};

const main = Object.assign(
  {
    debug,
    mix,
  },
  mainCore
);

// export default { mainCore, main };

// define([], { mainCore, main });

module.exports = { mainCore, main };