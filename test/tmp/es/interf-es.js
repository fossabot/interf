/**
 * @license
 * Interf <https://shvabuk.github.io/interf>
 * Released under MIT license <https://shvabuk.github.io/interf/LICENSE.txt>
 * Copyright Shvab Ostap
 */
;((root, factory) => {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node.
    const interf = factory();
    module.exports = interf;
    // CommonJS exports
    module.exports.interf = interf;
  } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
    // CommonJS
    exports.interf = factory();
  } else if (typeof root.interf !== 'object' || !Number.isInteger(root.interf.VERSION)) {
    root.interf = factory();
  }
})(this, () => {

  // ------------------------------------------------------------------------
  // utils block start

  // get object prototype
  const getProto = Object.getPrototypeOf || (obj => obj.__proto__);
  // add source array values to target array, source array values may be arguments object (is array like)
  const addArray = (target, source) => {
    const len = source.length;
    let i = -1;
    while (++i < len) {
      target.push(source[i]);
    }
    return target;
  };
  // merge source object values in target object recursively, arrays merged by addArray
  const mergeObjects = (target, source) => {
    const destination = target;
    const keys = Object.keys(source);
    let i = keys.length;
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
    const len = arguments.length;
    let i = -1;
    let ret = {};
    while (++i < len) {
      ret = mergeObjects(ret, arguments[i]);
    }
    return ret;
  }

  // get symbols, if method not provided, will return empty array, needed for getOwnPropsKeys
  const getSymbols = Object.getOwnPropertySymbols || (() => []);

  // utils block end
  // ------------------------------------------------------------------------

  // has own property check, usage: has.call(obj, 'propName');
  const hasProp = Object.prototype.hasOwnProperty;

  // main object
  const interf = {
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

  const CAPITAL_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  function parentHas(target, Interface) {
    const prototype = getProto(target);
    if (prototype === null) return false;
    const interfaces = prototype.constructor.__interfaces_;
    if (typeof interfaces !== 'undefined' && interfaces.has(Interface)) return true;
    return parentHas(prototype, Interface);
  }

  // Base interface class
  const InterfaceClass = class Interface {
    constructor(properties) {
      if (typeof properties.extends !== 'undefined' && !Array.isArray(properties.extends)) {
        throw TypeError('Interface extends should be an Array');
      }
      if (typeof properties.name === 'string' && properties.name.length !== 0) {
        const keys = Object.keys(properties);
        let i = keys.length;
        // while(i--) loop faster than any array buildin loops [].map(), [].find() etc.
        while (i--) {
          if (CAPITAL_CHARS.indexOf(keys[i][0]) > -1 || keys[i] === 'name' || keys[i] === 'extends') {
            this[keys[i]] = properties[keys[i]];
          } else {
            throw Error('Interface optional property name should start with capital letter');
          }
        }
      } else {
        throw TypeError('Interface should have a name');
      }
    }

    isInterfaceOf(object) {
      // code repeating here, same as in parentHas()
      // those solulution works faster than just using of parentHas()
      // TODO: check in others environments
      const prototype = getProto(object);
      if (prototype === null) return false;
      const interfaces = prototype.constructor.__interfaces_;
      if (typeof interfaces !== 'undefined' && interfaces.has(this)) return true;
      return parentHas(prototype, this);
    }
  };

  // interf.create(), create Interface
  function create(interfaceName, extendsArray) {
    // no need in rest args (...args), also minimize code (babel will transform it
    // to arguments anyway)
    const ar = arguments;
    if (typeof ar[0] === 'string') {
      const obj = { name: ar[0] };
      if (typeof ar[1] !== 'undefined') obj.extends = ar[1];
      return new InterfaceClass(obj);
    } else if (typeof ar[0] === 'object') {
      return new InterfaceClass(ar[0]);
    }
    throw TypeError('In method interf.create first parameter should be an object or Interface name');
  }

  // Interfaces objects are stored in __interfaces_
  class Interfaces {
    constructor(version) {
      this.collection = [];
      this.VERSION = version;
    }

    // add only unique, but not unique in extends or parent
    // mainly incoming parameter will be arguments object (array like)
    add(interfaces, constructorName) {
      const len = interfaces.length;
      let i = -1;
      while (++i < len) {
        let j = this.collection.length;
        // while(i--) loop faster than any array buildin loops [].map(), [].find() etc.
        while (j--) {
          if (this.collection[j] === interfaces[i]) {
            throw Error(`Class ${constructorName} cannot implement previously implemented interface ${interfaces[i].name}`);
          }
        }

        this.collection.push(interfaces[i]);
      }
      return this;
    }

    remove(Interface) {
      let i = this.collection.length;
      // while(i--) loop faster than any array buildin loops [].map(), [].find() etc.
      while (i--) {
        if (Interface === this.collection[i]) {
          this.collection.splice(i, 1);
          return true;
        }
      }
      return false;
    }

    // check instance interfaces
    // comparison is fastest solution
    has(Interface) {
      let i = this.collection.length;
      // while(i--) loop faster than any array buildin loops [].map(), [].find() etc.
      while (i--) {
        if (Interface === this.collection[i]) return true;
        // check extended interfaces
        if (typeof this.collection[i].extends === 'object' && this.extendsHas(Interface, this.collection[i].extends)) {
          return true;
        }
      }

      return false;
    }

    extendsHas(Interface, collection) {
      let i = collection.length;
      // while(i--) loop faster than any array buildin loops [].map(), [].find() etc.
      while (i--) {
        if (Interface === collection[i]) return true;
        // check extended interfaces
        if (typeof collection[i].extends !== 'undefined' && this.extendsHas(Interface, collection[i].extends)) {
          return true;
        }
      }
      return false;
    }
  }

  function configure(properties) {
    this._config = assignObjects(this._config, properties);

    // descriptor should be rewrited
    if (typeof properties.descriptor === 'object') {
      this._config.descriptor = properties.descriptor;
    }

    return this;
  }

  // debug information computing functions
  let debugs = false;

  // define __interfaces_ in prototype
  function defineInterfacesProp(proto, parent, options) {
    const value = new Interfaces(interf.version, parent);
    const descriptor = assignObjects(options.descriptor); // assign to empty object {}

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
    let i = interfaces.length;
    while (i--) {
      if (typeof interfaces[i] !== 'object') {
        throw TypeError(`Undefined type ${typeof interfaces[i]} of interface`);
      } else if (typeof interfaces[i].isInterfaceOf !== 'function') {
        throw TypeError(`Undefined type of interface: ${interfaces[i].name}`);
      }
    }
  }

  // implement interface function
  function implementIn(prototype, interfaces, options) {
    validateInterfaces(interfaces);

    const constructor = prototype.constructor;

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

    const constructor = prototype.constructor;
    const missed = [];
    const deleted = [];
    let collection;
    let success = false;
    let interfaced = false;
    if (hasProp.call(constructor, '__interfaces_')) {
      collection = constructor.__interfaces_.collection;

      let i = interfaces.length;
      // while(i--) loop faster than any array buildin loops [].map(), [].find() etc.
      while (i--) {
        const index = collection.indexOf(interfaces[i]);
        let warnMsg = '';

        if (index > -1) {
          if (constructor.__interfaces_.remove(interfaces[i])) {
            deleted.push(interfaces[i]);

            if (constructor.__interfaces_.has(interfaces[i])) {
              warnMsg = `removed, but interface still exist in other interfaces parents.`;
            }

            if (parentHas(prototype, interfaces[i])) {
              warnMsg += ` removed, but interface still exist in parents prototypes constructors interfaces.`;
            }
          } else {
            warnMsg = `not removed from own interfaces.`;
          }
        } else {
          warnMsg = `not found in own interfaces.`;

          missed.push(interfaces[i]);
        }

        if (options.warn && warnMsg.length > 0) {
          interf._config.callbacks.warn({
            message: `Constructor ${constructor.name}. Interface ${interfaces[i].name} was ${warnMsg}`
          });
        }
      }

      success = deleted.length === interfaces.length;

      interfaced = true;
    } else if (options.warn) {
      interf._config.callbacks.warn({
        message: `Constructor ${constructor.name} none interface was found. Interfaces ${addArray([], interfaces).map(Interface => Interface.name).join(', ')} was not removed from own interfaces.`
      });
    }

    if (options.debug && debugs) {
      debugs.remove(success, prototype, interfaces, interfaced, deleted, missed);
    }

    return success;
  }

  // empty function
  function emptyIn(prototype, options) {
    const constructor = prototype.constructor;
    let success = false;
    let interfaced = false;
    if (hasProp.call(constructor, '__interfaces_')) {
      // create new array
      const interfaces = addArray([], constructor.__interfaces_.collection);
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
    const ret = { values: args, options: {} };
    let descriptor;
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
    throw TypeError(`Wrong target, should be function (class) or prototype of function (class). Current value: ${target}.`);
  }

  // interf.implement()
  function implement() {
    // no need in rest args (...args), also minimize code (babel will transform it to arguments anyway)
    const args = resolveArgs(arguments);
    return {
      in: target => implementIn(targetProto(target), args.values, args.options)
    };
  }

  // interf.remove()
  function remove() {
    // no need in rest args (...args), also minimize code (babel will transform it to arguments anyway)
    const args = resolveArgs(arguments);
    return {
      in: target => removeIn(targetProto(target), args.values, args.options)
    };
  }

  // interf.empty()
  function empty(options) {
    const opts = resolveArgs([[], options]).options;
    return {
      in: target => emptyIn(targetProto(target), opts)
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
    getProto,
    getSymbols,
    addArray,
    mergeObjects,
    assignObjects
  };
  interf.internal = {
    Interface: InterfaceClass,
    Interfaces,
    implementIn,
    removeIn,
    emptyIn,
    debugs,
    resolveArgs,
    targetProto
  };

  // @NOT_CORE_BEGIN@

  // Interface for objects mixined with classes with constructor method, and mark that initMixins method are able
  const MixinsInitiable = create({
    name: 'MixinsInitiable',
    Comments: ['Class with this interface may init values provided by mixins'],
    Methods: ['initMixins'],
    StaticProperties: ['__mixins_: class[]'],
    Docs: '//shvabuk.github.io/interf'
  });

  // class for getting debug information
  class DebugInterfaces {
    constructor(prototype) {
      this.tree = [];
      this.initTree(prototype);
      this.list = [];
      this.initList();
    }

    // use proto chain here because we need proto info, that may not provided by parent property
    initTree(prototype) {
      let proto = prototype;
      while (true) {
        if (proto === null) {
          break;
        }

        if (hasProp.call(proto.constructor, '__interfaces_')) {
          const interfs = proto.constructor.__interfaces_.collection;
          this.tree.unshift({
            constructorName: proto.constructor.name,
            proto,
            interfaces: interfs
          });
        }

        proto = getProto(proto);
      }
      return this.tree;
    }

    initList() {
      const len = this.tree.length;
      let i = -1;
      // while(i--) loop faster than any array buildin loops [].map(), [].find() etc.
      while (++i < len) {
        this.addInfo(this.tree[i].proto, this.tree[i].interfaces, this.tree[i].constructorName, false);
      }
      return this.list;
    }

    addInfo(proto, collection, constructorName, extended) {
      const len = collection.length;
      let i = -1;
      while (++i < len) {
        const InterFace = collection[i];
        const info = { constructorName, asExtendedInterface: extended, proto };
        let result;
        let j = this.list.length;
        // while(i--) loop faster than any array buildin loops [].map(), [].find() etc.
        while (j--) {
          if (this.list[j].interface === InterFace) {
            result = this.list[j];
            break;
          }
        }
        if (typeof result === 'undefined') {
          this.list.push({ interface: InterFace, implementedIn: [info] });
        } else {
          result.implementedIn.push(info);
        }

        if (typeof InterFace.extends !== 'undefined') {
          this.addInfo(proto, InterFace.extends, constructorName, true);
        }
      }
      return this.list;
    }

    getDuplicates() {
      const results = [];

      const len = this.list.length;
      let i = -1;
      while (++i < len) {
        if (this.list[i].implementedIn.length > 1) results.push(this.list[i]);
      }

      return results;
    }

    getList() {
      return this.list;
    }

    getTree() {
      return this.tree;
    }
  }

  debugs = {
    define: (success, proto, value) => {
      interf._config.callbacks.debug({
        operation: 'define',
        success,
        message: `Constructor ${proto.constructor.name} prototype property __interfaces_ defined`,
        value,
        Constructor: proto.constructor
      });
    },
    implement: (success, proto, value) => {
      const allInterfaces = new DebugInterfaces(proto).getList();
      interf._config.callbacks.debug({
        operation: 'implement',
        success,
        message: `Constructor ${proto.constructor.name} implemented own interfaces: ${proto.constructor.__interfaces_.collection.map(InterFace => InterFace.name).join(', ')}. All ${proto.constructor.name} interfaces: ${allInterfaces.map(data => data.interface.name).join(', ')}`,
        value,
        allInterfaces,
        Constructor: proto.constructor
      });
    },
    remove: (success, proto, interfs, interfaced, deleted, missed) => {
      if (interfaced) {
        const stillExist = [];
        const interfacesList = new DebugInterfaces(proto).getList();
        const listLen = interfacesList.length;
        let i = -1;
        while (++i < listLen) {
          const len = interfs.length;
          let j = -1;
          while (++j < len) {
            if (interfacesList[i].interface === interfs[j]) {
              stillExist.push(interfacesList[i]);
              break;
            }
          }
        }

        const data = {
          operation: 'remove',
          success,
          message: `Constructor ${proto.constructor.name}.${(deleted.length > 0 ? ` Own interfaces: ${deleted.map(InterFace => InterFace.name).join(', ')} was deleted.` : '') + (missed.length > 0 ? ` Own interfaces: ${missed.map(InterFace => InterFace.name).join(', ')} was not found in ${proto.constructor.name} interfaces collection.` : '') + (stillExist.length > 0 ? ` Interfaces: ${stillExist.map(listednterface => listednterface.interface.name).join(', ')} still exist in parents constructor prototypes or parents interfaces.` : '')}`,
          value: interfs,
          Constructor: proto.constructor,
          deleted,
          missed,
          stillExist,
          list: interfacesList
        };

        interf._config.callbacks.debug(data);
      } else {
        interf._config.callbacks.debug({
          operation: 'remove',
          success,
          message: `Constructor ${proto.constructor.name} does not implement interf interfaces. Interface removing is not possible`,
          value: interfs,
          Constructor: proto.constructor
        });
      }
    },
    empty: (success, proto, value, interfaced) => {
      if (interfaced) {
        interf._config.callbacks.debug({
          operation: 'empty',
          success,
          message: `Constructor ${proto.constructor.name} empty ${success ? '' : 'not '}all own interfaces`,
          value,
          Constructor: proto.constructor
        });
      } else {
        interf._config.callbacks.debug({
          operation: 'empty',
          success: false,
          message: `Constructor ${proto.constructor.name} does not implement interf interfaces. Interface empty is not possible`,
          value,
          Constructor: proto.constructor
        });
      }
    },
    mixProperties: (success, target, mixin, debugData) => {
      const data = debugData;
      const isPrototype = typeof target !== 'function';
      data.success = success;
      data.Constructor = isPrototype ? target.constructor : target;
      data.message = `Constructor ${data.Constructor.name + (isPrototype ? ' prototype' : '')} mixed with ${(isPrototype ? mixin.constructor.name : mixin.name) + (isPrototype ? ' prototype' : '')} properties.${data.notReplaced.length > 0 ? ` Not replaced properties: ${data.notReplaced.join(', ')}` : ''}`;

      data.value = mixin;
      interf._config.callbacks.debug(data);
    }
  };

  // get props names, used in mixin
  function getOwnPropsKeys(target) {
    return addArray(Object.getOwnPropertyNames(target), getSymbols(target));
  }

  function implementByMixIn(target, interfaces, options) {
    const prototype = targetProto(target);
    // create new array, transform arguments to array
    const interfs = addArray([], interfaces);

    let i = interfs.length;
    // while(i--) loop faster than any array buildin loops [].map(), [].find() etc.
    while (i--) {
      // ignore duplicates
      if (hasProp.call(prototype.constructor, '__interfaces_') && prototype.constructor.__interfaces_.collection.indexOf(interfs[i]) > -1) {
        interfs.splice(i, 1);
      }
    }

    return implementIn(prototype, interfs, options);
  }

  // define mixin (constructor or prototype) properties
  function defineProps(target, mixin, options, ignore) {
    const mixinNames = getOwnPropsKeys(mixin);
    const targetNames = getOwnPropsKeys(target);
    const debugData = {
      operation: 'mixProperties',
      target,
      mixin,
      ignoredNames: [],
      notReplaced: [],
      replaced: [],
      defined: [],
      writed: []
    };

    let i = mixinNames.length;
    // while(i--) loop faster than any array buildin loops [].map(), [].find() etc.
    while (i--) {
      // ignore props from ignorelist
      if (ignore.indexOf(mixinNames[i]) > -1) {
        if (options.debug) debugData.ignoredNames.push(mixinNames[i]);
        continue;
      }
      // implement interfaces
      if (mixinNames[i] === '__interfaces_') {
        if (options.interfaces) {
          implementByMixIn(target, mixin.__interfaces_.collection, options);
          if (options.debug) debugData.interfaces = mixin.__interfaces_.collection;
        }
        continue;
      }

      const descriptor = Object.getOwnPropertyDescriptor(mixin, mixinNames[i]);
      // check prop name in target
      if (targetNames.indexOf(mixinNames[i]) > -1) {
        // add mixins constructors if exists
        if (mixinNames[i] === '__mixins_') {
          addArray(target.__mixins_, mixin.__mixins_);
          if (options.debug) debugData.mixins = mixin.__mixins_;
        } else {
          const isProto = typeof target === 'object';

          if (options.warn) {
            interf._config.callbacks.warn({
              message: `Target ${isProto ? `${target.constructor.name} prototype` : target.name} alredy have mixin (${isProto ? `${mixin.constructor.name} prototype` : mixin.name}) property "${mixinNames[i]}". Will be ${options.replace ? 'replaced' : 'ignored'}.`
            });
          }

          if (options.replace) {
            // resolve conflicts
            const targetDescriptor = Object.getOwnPropertyDescriptor(target, mixinNames[i]);
            if (!targetDescriptor.configurable) {
              if (targetDescriptor.writable) {
                // write property
                target[mixinNames[i]] = mixin[mixinNames[i]];
                if (options.debug) debugData.writed.push(mixinNames[i]);
              } else if (options.notConfigurableNotWritableError) {
                try {
                  // show some additional info
                  console.error('Trying to define not configurable and not writable value. Interf mixin debug info', debugData);
                } catch (e) {}
                // force error throwing
                Object.defineProperty(target, mixinNames[i], descriptor);
              } else {
                // ignore if options.notConfigurableNotWritableError = false and targetDescriptor.configurable true
                if (options.debug) debugData.notReplaced.push(mixinNames[i]);
                if (options.warn) {
                  interf._config.callbacks.warn({
                    message: `Mixin ${isProto ? `${mixin.constructor.name} prototype` : mixin.name} property "${mixinNames[i]}" ignored, because is not writable and not configurable`
                  });
                }
              }
            } else {
              // replace value
              Object.defineProperty(target, mixinNames[i], descriptor);
              if (options.debug) debugData.replaced.push(mixinNames[i]);
            }
          } else if (options.debug) {
            // ignore if options.replace == false
            debugData.notReplaced.push(mixinNames[i]);
          }
        }
      } else {
        // define property
        Object.defineProperty(target, mixinNames[i], descriptor);
        if (options.debug) debugData.defined.push(mixinNames[i]);
      }
    }

    if (options.debug && debugs) debugs.mixProperties(true, target, mixin, debugData);
  }

  // return initMixins function, MixinsInitiable objects method
  // may be used if interf._config.mixin.createInit or options.createInit is true
  function createInitMixins(replace) {
    return function initMixins() {
      // no need in rest args (...args), also minimize code (babel will transform it to arguments anyway)
      let prototype = getProto(this);
      while (true) {
        if (prototype === null) {
          break;
        }

        if (hasProp.call(prototype.constructor, '__mixins_')) {
          const length = prototype.constructor.__mixins_.length;
          let j = -1;
          while (++j < length) {
            // const mixinObject = new prototype.constructor.__mixins_[j](...args);
            // compiled by babel
            const mixinObject = new (Function.prototype.bind.apply(prototype.constructor.__mixins_[j], addArray([null], arguments)))();
            const keys = Object.keys(mixinObject);
            let i = keys.length;
            // while(i--) loop faster than any array buildin loops [].map(), [].find() etc.
            while (i--) {
              if (typeof this[keys[i]] === 'undefined' || replace) {
                this[keys[i]] = mixinObject[keys[i]];
              }
            }
          }
        }

        prototype = getProto(prototype);
      }
    };
  }

  // mixin function
  function mixIn(targetPrototype, mixins, options) {
    const mixinsConstructors = [];
    const len = mixins.length;
    let i = -1;
    while (++i < len) {
      const mixinProto = targetProto(mixins[i]);
      defineProps(targetPrototype, mixinProto, options, options.ignore.protoProps);
      defineProps(targetPrototype.constructor, mixinProto.constructor, options, options.ignore.staticProps);
      if (options.createInit) mixinsConstructors.push(mixinProto.constructor);
    }

    if (options.createInit) {
      if (typeof targetPrototype.__interfaces_ === 'undefined' || !targetPrototype.__interfaces_.has(MixinsInitiable)) {
        Object.defineProperty(targetPrototype, 'initMixins', {
          configurable: true,
          writable: true,
          value: createInitMixins(!!options.replace) // always convert replace to primitive
        });

        if (typeof targetPrototype.constructor.__interfaces_ !== 'object' || targetPrototype.constructor.__interfaces_.collection.indexOf(MixinsInitiable) === -1) {
          implement(MixinsInitiable).in(targetPrototype);
        }
      }

      if (hasProp.call(targetPrototype.constructor, '__mixins_')) {
        addArray(targetPrototype.constructor.__mixins_, mixinsConstructors);
      } else {
        Object.defineProperty(targetPrototype.constructor, '__mixins_', {
          configurable: true,
          writable: true,
          value: mixinsConstructors
        });
      }
    }

    return targetPrototype.constructor;
  }

  // debug function
  function debugIn(prototype, actions) {
    const information = {};
    let i = actions.length;
    const debugInfo = new DebugInterfaces(prototype);

    // while(i--) loop faster than any array buildin loops [].map(), [].find() etc.
    while (i--) {
      if (actions[i] === 'duplicates') {
        information.duplicates = debugInfo.getDuplicates();
      } else if (actions[i] === 'tree') {
        information.tree = debugInfo.getTree();
      } else if (actions[i] === 'list') {
        information.list = debugInfo.getList();
      }
    }

    return information;
  }

  // interf.debug() resolve given arguments and run debug
  function debug(action) {
    const allActions = ['duplicates', 'tree', 'list'];
    let values;
    if (typeof action === 'undefined') {
      values = allActions;
    } else if (typeof action === 'string') {
      if (action === 'all') {
        values = allActions;
      } else {
        values = [action];
      }
    } else if (Array.isArray(action)) {
      values = action;
    } else {
      throw TypeError(`debug first argument should be undefined, array, or string (${allActions.join(', ')}, all)`);
    }

    return {
      in: target => debugIn(targetProto(target), values)
    };
  }

  // interf.mix()
  function mix() {
    // no need in rest args (...args), also minimize code (babel will transform it to arguments anyway)
    const args = resolveArgs(arguments, 'mixin');

    return {
      in: target => mixIn(targetProto(target), args.values, args.options)
    };
  }

  // full
  interf.mix = mix;
  interf.debug = debug;
  // additional
  interf.interfaces = { MixinsInitiable };
  interf.internal.DebugInterfaces = DebugInterfaces;
  interf.internal.mixIn = mixIn;
  interf.internal.debugIn = debugIn;
  interf.internal.debugs = debugs;

  // @NOT_CORE_END@

  return interf;
});
//# sourceMappingURL=interf-es.js.map
