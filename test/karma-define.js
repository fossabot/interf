var mainCore = [
  test.default,
  utils.default,
  create.default,
  implement.default,
  remove.default,
  empty.default,
  _in.default,
  descriptor.default,
];

var main = mainCore.concat([debug.default, mix.default]);

var that = this;
var interfs = [];

function define(ar1, factory) {
  interfs.push(factory.call(that));
}

define.amd = true;
