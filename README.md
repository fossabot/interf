# [INTERF](https://shvabuk.github.io/interf)

Interf is [fast](performance.md) and small javascript library.
It makes possible to determine whether a object is an instantiated of a class that implements an interface.
And it is possible to copy class and class.prototype properties by [mix().in()](api/mixin/mix-in.md) too.

## [API Docs](https://shvabuk.github.io/interf/docs)

## Basic usage

``` javascript
// create interface
const Quackable = interf.create('Quackable');
// "implement" interface
const Duck = interf.implement(Quackable).in(class Duck {});
// create instance
const donald = new Duck();
// test instance
Quackable.isInterfaceOf(donald); // true
```

## Download

* [Core build](//raw.githubusercontent.com/shvabuk/interf/master/dist/interf-core.js) ([~2kB gzipped](//raw.githubusercontent.com/shvabuk/interf/master/dist/interf-core.min.js))
* [Full build](//raw.githubusercontent.com/shvabuk/interf/master/dist/interf.js) ([~4kB gzipped](//raw.githubusercontent.com/shvabuk/interf/master/dist/interf.min.js))
* [CDN jsdelivr](https://cdn.jsdelivr.net/npm/interf)
* [CDN unpkg](https://unpkg.com/interf/dist/interf.min.js)

## Installation

Using npm:
``` shell
$ npm install --save interf
```

In Node.js:
``` javascript
const interf = require('interf');
```

In a browser:
``` html
<script src="interf.js"></script>
```

## Configuration
``` javascript
// default configuration
interf.configure({
  warn: false,
  debug: false, // ignored in core build
  afterImplement: false,
  descriptor: {
    // value: (auto-defined,
    // in case when setter is defined will be auto-assigned),
    configurable: true,
    writable: false,
    enumerable: false,
    // set: undefined,
    // get: undefined,
  },
  callbacks: {
    warn: (data) => {
      if (typeof console === 'object' && console.warn) {
        console.warn(data.message);
      }
    },
    // ignored in core build
    debug: (data) => {
      if (typeof console === 'object' && console.log) {
        console.log(data.message, data);
      }
    },
    afterImplement: (classInterfaces, Class, interfaces) => {},
  },
  // ignored in core build
  mixin: {
    // warn: false, // if not defined, will be same as in parent scope
    // debug: false, // if not defined, will be same as in parent scope
    // callbacks: {}, // if not defined, will be same as in parent scope
    createInit: true, // create initMixins method in target prototype
    interfaces: true,
    replace: true,
    notConfigurableNotWritableError: true, // ignored if replace == false,
    ignore: {
      protoProps: [
        'constructor',
        'apply',
        'bind',
        'call',
        'isGenerator',
        'toSource',
        'toString',
        '__proto__',
      ],
      staticProps: [
        'arguments',
        'arity',
        'caller',
        'length',
        'name',
        'displayName',
        'prototype',
        '__proto__',
      ],
    },
  },
});
```

## Support
Tested in:
* Chrome 58 - 59
* Firefox 54
* IE 9 - 11
* Safari 5.1.7
* Opera 45
* Node.js 6
* PhantomJS 2.1.14

## License

Interf is released under the [MIT license](//raw.githubusercontent.com/shvabuk/interf/master/LICENSE.txt)
