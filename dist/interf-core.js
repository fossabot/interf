/**
 * @license
 * Interf <https://shvabuk.github.io/interf>
 * Released under MIT license <https://shvabuk.github.io/interf/LICENSE.txt>
 * Copyright Shvab Ostap
 */
;(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node.
    var interf = factory();
    module.exports = interf;
    // CommonJS exports
    module.exports.interf = interf;
  } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
    // CommonJS
    exports.interf = factory();
  } else if (typeof root.interf !== 'object' || !Number.isInteger(root.interf.VERSION)) {
    root.interf = factory();
  }
})(this, function () {
  'use strict';
  // ------------------------------------------------------------------------
  // utils block start

  // get object prototype

  var getProto = Object.getPrototypeOf || function (obj) {
    return obj.__proto__;
  };
  // add source array values to target array, source array values may be arguments object (is array like)
  var addArray = function addArray(target, source) {
    var len = source.length;
    var i = -1;
    while (++i < len) {
      target.push(source[i]);
    }
    return target;
  };
  // merge source object values in target object recursively, arrays merged by addArray
  var mergeObjects = function mergeObjects(target, source) {
    var destination = target;
    var keys = Object.keys(source);
    var i = keys.length;
    while (i--) {
      if (Array.isArray(source[keys[i]])) {
        if (Array.isArray(destination[keys[i]])) {
          // append array
          destination[keys[i]] = addArray(destination[keys[i]], source[keys[i]]);
        } else {
          // create new array
          destination[keys[i]] = addArray([], source[keys[i]]);
        }
      } else if (typeof source[keys[i]] === 'object') {
        if (typeof destination[keys[i]] === 'object') {
          // mutate destination[key]
          destination[keys[i]] = mergeObjects(destination[keys[i]], source[keys[i]]);
        } else {
          // merge source[key] to new object
          destination[keys[i]] = mergeObjects({}, source[keys[i]]);
        }
      } else {
        destination[keys[i]] = source[keys[i]];
      }
    }

    return destination;
  };
  // merge objects values in new obj, arrays merged
  function assignObjects() {
    var arguments$1 = arguments;

    var len = arguments.length;
    var i = -1;
    var ret = {};
    while (++i < len) {
      ret = mergeObjects(ret, arguments$1[i]);
    }
    return ret;
  }

  // get symbols, if method not provided, will return empty array, needed for getOwnPropsKeys
  var getSymbols = Object.getOwnPropertySymbols || function () {
    return [];
  };

  // utils block end
  // ------------------------------------------------------------------------

  // has own property check, usage: has.call(obj, 'propName');
  var hasProp = Object.prototype.hasOwnProperty;

  // main object
  var interf = {
    // integer count of all versions, current version: 1.0.0
    VERSION: 1,
    _config: {
      // use interf.configure to set config values
      warn: false,
      debug: false, // ignored in core build
      afterImplement: false,
      descriptor: {
        // value: (auto-defined, in case when setter is defined will be auto-assigned),
        configurable: true,
        writable: false,
        enumerable: false
        // set: undefined,
        // get: undefined,
      },
      callbacks: {
        warn: function warnCallback(data) {
          if (typeof console === 'object' && console.warn) console.warn(data.message);
        },
        // ignored in core build
        debug: function debugCallback(data) {
          if (typeof console === 'object' && console.log) console.log(data.message, data);
        },
        afterImplement: function afterImplementCallback(classInterfaces, Class, interfaces) {}
      },
      // ignored in core build
      mixin: {
        // warn: this.,
        // debug: false,
        createInit: true, // create initMixins method in target prototype
        interfaces: true,
        replace: true,
        notConfigurableNotWritableError: true, // ignored if replace == false,
        // https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Global_Objects/Function/prototype
        ignore: {
          protoProps: ['constructor', 'apply', 'bind', 'call', 'isGenerator', 'toSource', 'toString', '__proto__'],
          staticProps: ['arguments', 'arity', 'caller', 'length', 'name', 'displayName', 'prototype', '__proto__']
        }
      }
    }
  };

  var CAPITAL_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  function parentHas(target, Interface) {
    var prototype = getProto(target);
    if (prototype === null) return false;
    var interfaces = prototype.constructor.__interfaces_;
    if (typeof interfaces !== 'undefined' && interfaces.has(Interface)) return true;
    return parentHas(prototype, Interface);
  }

  // Base interface class
  var InterfaceClass = (function () {
    function Interface(properties) {
    var this$1 = this;

      if (typeof properties.extends !== 'undefined' && !Array.isArray(properties.extends)) {
        throw TypeError('Interface extends should be an Array');
      }
      if (typeof properties.name === 'string' && properties.name.length !== 0) {
        var keys = Object.keys(properties);
        var i = keys.length;
        // while(i--) loop faster than any array buildin loops [].map(), [].find() etc.
        while (i--) {
          if (CAPITAL_CHARS.indexOf(keys[i][0]) > -1 || keys[i] === 'name' || keys[i] === 'extends') {
            this$1[keys[i]] = properties[keys[i]];
          } else {
            throw Error('Interface optional property name should start with capital letter');
          }
        }
      } else {
        throw TypeError('Interface should have a name');
      }
    }

    Interface.prototype.isInterfaceOf = function isInterfaceOf (object) {
      // code repeating here, same as in parentHas()
      // those solulution works faster than just using of parentHas()
      // TODO: check in others environments
      var prototype = getProto(object);
      if (prototype === null) return false;
      var interfaces = prototype.constructor.__interfaces_;
      if (typeof interfaces !== 'undefined' && interfaces.has(this)) return true;
      return parentHas(prototype, this);
    };

    return Interface;
  }());

  // interf.create(), create Interface
  function create(interfaceName, extendsArray) {
    // no need in rest args (...args), also minimize code (babel will transform it
    // to arguments anyway)
    var ar = arguments;
    if (typeof ar[0] === 'string') {
      var obj = { name: ar[0] };
      if (typeof ar[1] !== 'undefined') obj.extends = ar[1];
      return new InterfaceClass(obj);
    } else if (typeof ar[0] === 'object') {
      return new InterfaceClass(ar[0]);
    }
    throw TypeError('In method interf.create first parameter should be an object or Interface name');
  }

  // Interfaces objects are stored in __interfaces_
  var Interfaces = function Interfaces(version) {
    this.collection = [];
    this.VERSION = version;
  };

  // add only unique, but not unique in extends or parent
  // mainly incoming parameter will be arguments object (array like)
  Interfaces.prototype.add = function add (interfaces, constructorName) {
      var this$1 = this;

    var len = interfaces.length;
    var i = -1;
    while (++i < len) {
      var j = this$1.collection.length;
      // while(i--) loop faster than any array buildin loops [].map(), [].find() etc.
      while (j--) {
        if (this$1.collection[j] === interfaces[i]) {
          throw Error('Class ' + constructorName + ' cannot implement previously implemented interface ' + interfaces[i].name);
        }
      }

      this$1.collection.push(interfaces[i]);
    }
    return this;
  };

  Interfaces.prototype.remove = function remove$1 (Interface) {
      var this$1 = this;

    var i = this.collection.length;
    // while(i--) loop faster than any array buildin loops [].map(), [].find() etc.
    while (i--) {
      if (Interface === this$1.collection[i]) {
        this$1.collection.splice(i, 1);
        return true;
      }
    }
    return false;
  };

  // check instance interfaces
  // comparison is fastest solution
  Interfaces.prototype.has = function has (Interface) {
      var this$1 = this;

    var i = this.collection.length;
    // while(i--) loop faster than any array buildin loops [].map(), [].find() etc.
    while (i--) {
      if (Interface === this$1.collection[i]) return true;
      // check extended interfaces
      if (typeof this$1.collection[i].extends === 'object' && this$1.extendsHas(Interface, this$1.collection[i].extends)) {
        return true;
      }
    }

    return false;
  };

  Interfaces.prototype.extendsHas = function extendsHas (Interface, collection) {
      var this$1 = this;

    var i = collection.length;
    // while(i--) loop faster than any array buildin loops [].map(), [].find() etc.
    while (i--) {
      if (Interface === collection[i]) return true;
      // check extended interfaces
      if (typeof collection[i].extends !== 'undefined' && this$1.extendsHas(Interface, collection[i].extends)) {
        return true;
      }
    }
    return false;
  };

  function configure(properties) {
    this._config = assignObjects(this._config, properties);

    // descriptor should be rewrited
    if (typeof properties.descriptor === 'object') {
      this._config.descriptor = properties.descriptor;
    }

    return this;
  }

  // debug information computing functions
  var debugs = false;

  // define __interfaces_ in prototype
  function defineInterfacesProp(proto, parent, options) {
    var value = new Interfaces(interf.version, parent);
    var descriptor = assignObjects(options.descriptor); // assign to empty object {}

    if (typeof interf._config.descriptor.set !== 'function') {
      descriptor.value = value;
    }

    Object.defineProperty(proto.constructor, '__interfaces_', descriptor);
    if (typeof descriptor.set === 'function') {
      proto.constructor.__interfaces_ = value;
    }

    if (options.debug && debugs) debugs.define(true, proto, value);
  }

  function validateInterfaces(interfaces) {
    var i = interfaces.length;
    while (i--) {
      if (typeof interfaces[i] !== 'object') {
        throw TypeError('Undefined type ' + typeof interfaces[i] + ' of interface');
      } else if (typeof interfaces[i].isInterfaceOf !== 'function') {
        throw TypeError('Undefined type of interface: ' + interfaces[i].name);
      }
    }
  }

  // implement interface function
  function implementIn(prototype, interfaces, options) {
    validateInterfaces(interfaces);

    var constructor = prototype.constructor;

    if (!hasProp.call(constructor, '__interfaces_')) {
      defineInterfacesProp(prototype, null, options);
    }

    // add intefaces to prototype
    constructor.__interfaces_.add(interfaces, constructor.name);

    if (interf._config.afterImplement) {
      interf._config.callbacks.afterImplement(constructor.__interfaces_, constructor, interfaces);
    }

    if (options.debug && debugs) debugs.implement(true, prototype, interfaces);

    return constructor;
  }

  // remove function
  function removeIn(prototype, interfaces, options) {
    validateInterfaces(interfaces);

    var constructor = prototype.constructor;
    var missed = [];
    var deleted = [];
    var collection = void 0;
    var success = false;
    var interfaced = false;
    if (hasProp.call(constructor, '__interfaces_')) {
      collection = constructor.__interfaces_.collection;

      var i = interfaces.length;
      // while(i--) loop faster than any array buildin loops [].map(), [].find() etc.
      while (i--) {
        var index = collection.indexOf(interfaces[i]);
        var warnMsg = '';

        if (index > -1) {
          if (constructor.__interfaces_.remove(interfaces[i])) {
            deleted.push(interfaces[i]);

            if (constructor.__interfaces_.has(interfaces[i])) {
              warnMsg = 'removed, but interface still exist in other interfaces parents.';
            }

            if (parentHas(prototype, interfaces[i])) {
              warnMsg += ' removed, but interface still exist in parents prototypes constructors interfaces.';
            }
          } else {
            warnMsg = 'not removed from own interfaces.';
          }
        } else {
          warnMsg = 'not found in own interfaces.';

          missed.push(interfaces[i]);
        }

        if (options.warn && warnMsg.length > 0) {
          interf._config.callbacks.warn({
            message: 'Constructor ' + constructor.name + '. Interface ' + interfaces[i].name + ' was ' + warnMsg
          });
        }
      }

      success = deleted.length === interfaces.length;

      interfaced = true;
    } else if (options.warn) {
      interf._config.callbacks.warn({
        message: 'Constructor ' + constructor.name + ' none interface was found. Interfaces ' + addArray([], interfaces).map(function (Interface) {
          return Interface.name;
        }).join(', ') + ' was not removed from own interfaces.'
      });
    }

    if (options.debug && debugs) {
      debugs.remove(success, prototype, interfaces, interfaced, deleted, missed);
    }

    return success;
  }

  // empty function
  function emptyIn(prototype, options) {
    var constructor = prototype.constructor;
    var success = false;
    var interfaced = false;
    if (hasProp.call(constructor, '__interfaces_')) {
      // create new array
      var interfaces = addArray([], constructor.__interfaces_.collection);
      if (interfaces.length !== 0) {
        success = removeIn(prototype, interfaces, options);
      }

      interfaced = true;
    }

    if (options.debug && debugs) debugs.empty(success, prototype, null, interfaced);

    return success;
  }

  // resolve input arguments
  function resolveArgs(args, section) {
    var ret = { values: args, options: {} };
    var descriptor = void 0;
    if (Array.isArray(args[0])) {
      ret.values = args[0];
      if (typeof args[1] === 'object') {
        ret.options = args[1];
        if (typeof ret.options.descriptor === 'object') {
          descriptor = ret.options.descriptor;
        }
      }
    }

    if (typeof section === 'string') {
      ret.options = assignObjects(interf._config, interf._config[section], ret.options);
    } else {
      ret.options = assignObjects(interf._config, ret.options);
    }

    // special rule for descriptor option
    // descriptor should be rewrited
    if (typeof descriptor !== 'undefined') {
      ret.options.descriptor = descriptor;
    }

    return ret;
  }

  // get proto of given in ".in(target)" method argument
  function targetProto(target) {
    if (typeof target === 'function') {
      return target.prototype;
    } else if (
    // check is protolike object
    typeof target.constructor === 'function' && target.constructor.prototype === target) {
      return target;
    }
    throw TypeError('Wrong target, should be function (class) or prototype of function (class). Current value: ' + target + '.');
  }

  // interf.implement()
  function implement() {
    // no need in rest args (...args), also minimize code (babel will transform it to arguments anyway)
    var args = resolveArgs(arguments);
    return {
      in: function _in(target) {
        return implementIn(targetProto(target), args.values, args.options);
      }
    };
  }

  // interf.remove()
  function remove() {
    // no need in rest args (...args), also minimize code (babel will transform it to arguments anyway)
    var args = resolveArgs(arguments);
    return {
      in: function _in(target) {
        return removeIn(targetProto(target), args.values, args.options);
      }
    };
  }

  // interf.empty()
  function empty(options) {
    var opts = resolveArgs([[], options]).options;
    return {
      in: function _in(target) {
        return emptyIn(targetProto(target), opts);
      }
    };
  }

  // core
  interf.create = create;
  interf.implement = implement;
  interf.remove = remove;
  interf.empty = empty;
  interf.configure = configure;
  // core additional
  interf.utils = {
    getProto: getProto,
    getSymbols: getSymbols,
    addArray: addArray,
    mergeObjects: mergeObjects,
    assignObjects: assignObjects
  };
  interf.internal = {
    Interface: InterfaceClass,
    Interfaces: Interfaces,
    implementIn: implementIn,
    removeIn: removeIn,
    emptyIn: emptyIn,
    debugs: debugs,
    resolveArgs: resolveArgs,
    targetProto: targetProto
  };

  // Here was full version code

  return interf;
});
//# sourceMappingURL=interf.js.map
