# interf.configure\(\)

**Description:** Configure interf library.

---
> ```javascript
interf.configure(properties);
return :O: interf;
```
> 
> **properties**  
> Type: :O: PlainObject  
> ##### A map of properties to pass to the method.
> 
> | Property name | Description |
> | :--- | :--- |
> | debug | :B: Boolean. Optional. (default: false) Option to call callbacks.debug (avialable only in full build) |
> | warn | :B: Boolean. Optional. (default: false) Option to call callbacks.warn. |
> | afterImplement | :B: Boolean. Optional. (default: false) Option to call callbacks.afterImplement. |
> | callbacks.debug | :F: Function. Optional. (default: (data) => {if (typeof console === 'object' && console.log) console.log(data.message, data);}) (avialable only in full build)|
> | callbacks.warn | :F: Function. Optional. (default: (data) => {if (typeof console === 'object' && console.warn) console.warn(data.message);}) May be called by [remove().in()](remove-in.md), [empty().in()](empty-in.md) or [mix().in()](../mixin/mix-in.md) methods |
> | callbacks.afterImplement | :F: Function. Optional. (default: (classInterfaces, Class, interfaces) => {}) |
> | mixin | :O: PlainObject. Optional. (default see map below) mixin specific properties, see map below (avialable only in full build) |
> | descriptor | :O: PlainObject. Optional. (default: { configurable: true }) The descriptor for the '[\_\_interfaces\_](interfaces_.md)' property being defined for target class and parents classes as static property. This value will not inherit properties from parent config. |
> 
> ##### A map of descriptor properties for Class.\_\_interfaces\_ property (more information about descriptor may be found here: [Object.defineProperty()](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)).
> 
> | Property name | Description |
> | :--- | :--- |
> | configurable | :B: Boolean. Optional. (default: true) true if and only if the type of this property descriptor may be changed and if the property may be deleted from the corresponding object. |
> | enumerable | :B: Boolean. Optional. (default: false) true if and only if this property shows up during enumeration of the properties on the corresponding object. |
> | value | NONE. (auto-defined, in case when set is defined will be auto-assigned) |
> | writable | :B: Boolean. Optional. (default: false) true if and only if the value associated with the property may be changed with an assignment operator. |
> | get | :F: Function. Optional. (default: undefined) A function which serves as a getter for the property, or undefined if there is no getter. The function return will be used as the value of property. |
> | set | :F: Function. Optional. (default: undefined) A function which serves as a setter for the property, or undefined if there is no setter. The function will receive as only argument the new value being assigned to the property. |
> 
> ##### A map of mixin properties.
> 
> | Property name | Description |
> | :--- | :--- |
> | debug | :B: Boolean. Optional. (default: interf.\_config.debug) Option to call callbacks.debug |
> | warn | :B: Boolean. Optional. (default: interf.\_config.warn) Option to call callbacks.warn. |
> | callbacks.debug | :F: Function. Optional. (default: interf.\_config.callbacks.debug) |
> | callbacks.warn | :F: Function. Optional. (default: interf.\_config.callbacks.warn) |
> | createInit | :B: Boolean. Optional. (default: true) Create initMixins method in target prototype. initMixins method will create objects (instances) of mixins and copy all objects properties to target object. [MixinsInitiable](../mixin/mixinsinitiable.md) interface will be added too. |
> | interfaces | :B: Boolean. Optional. (default: true) Copy mixins interfaces to target. |
> | replace | :B: Boolean. Optional. (default: true) If properties with same names will be found in target and mixin, will be replaced by new (from mixin, prefer last). |
> | notConfigurableNotWritableError | :B: Boolean. Optional. (default: true) If replace is set to true and will be found property with same name and target property will be not configurable and not writable, property will be tryed to defined. This will throw Error. If false, property will be not tryed to defined, also Error will be not throwed. |
> | ignore.protoProps | :A: Array. Optional. (default: ['constructor', 'apply', 'bind', 'call', 'isGenerator', 'toSource', 'toString', '\_\_proto\_\_']) Class proptotype properties names that will be ignored anyway. New properties will be added to array. |
> | ignore.staticProps | :A: Array. Optional. (default: ['arguments', 'arity', 'caller', 'length', 'name', 'displayName', 'prototype', '\_\_proto\_\_']) Class properties (static) names that will be ignored anyway. New properties will be added to array. |
> 
> ---
> 
> Return value  
> Type: :O: **Object**  
> Interf library

#### Examples

```javascript
const interf = require('interf').configure({
    warn: false,
    mixin: {
        createInit: false,
        ignore: {
            staticProps: ['myStaticPropertyNotCopiedByMixin']
        }
    }
});
```