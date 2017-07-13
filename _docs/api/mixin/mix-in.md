# interf.mix\(\).in\(\)

**Description:** Mixin method. It exist many different mixins for JS objects and classes. They will not copy information about interfaces or will copy it incorrect. This is a reason why this method was writed. This method copy properties from sources to tatget class and prototype by Object.defineProperty(), exept not configurable properties (if property is not configurable but writable it will be copied by assign). This method provide initMixins method to every target prototype if createInit is set to true.

---
> ```javascript
> interf.mix([source1[, source2[, ...[, sourceN]]]]).in(target);
> return :C: target|target.constructor;
> ```
> 
> **sourceN**  
> Type: :C: Class or :O: Class.prototype  
> A source class or source class prototype.
>
> ---
>
> **target**  
> Type: :C: Class or :O: Class.prototype  
> Class to which or class prototype to which constructor and prototype will be sets properties from source.
> 
> ---
> 
> Return value  
> Type: :C: **Class**  
> Class of target  
> 

---

> ```javascript
> interf.mix(sourcesArray[, options]).in(target);
> return :C: target|target.constructor;
> ```
> 
> **sourcesArray**  
> Type: :A: Array  
> Array of source classes or source classes prototypes.
>
> ---
>
> **options**  
> Type: :O: PlainObject  
> ##### A map of options to pass to the method.
> 
> | Property name | Description |
> | :--- | :--- |
> | debug | :B: Boolean. Optional. (default: [interf.\_config.mixin.debug](../core/configure.md)) Option to call callbacks.debug |
> | warn | :B: Boolean. Optional. (default: [interf.\_config.mixin.warn](../core/configure.md)) Option to call callbacks.warn. |
> | callbacks.debug | :F: Function. Optional. (default: [interf.\_config.mixin.callbacks.debug](../core/configure.md)) |
> | callbacks.warn | :F: Function. Optional. (default: [interf.\_config.mixin.callbacks.warn](../core/configure.md)). It may be called in cases if some property will be replaced by new or ignored, or be ignored, because target property is not writable and not configurable. |
> | createInit | :B: Boolean. Optional. (default: [interf.\_config.mixin.createInit](../core/configure.md)) Create initMixins method in target prototype. initMixins method will create objects (instances) of mixins and copy all objects properties to target object. [MixinsInitiable](mixinsinitiable.md) interface will be added too. |
> | interfaces | :B: Boolean. Optional. (default: [interf.\_config.mixin.interfaces](../core/configure.md)) Copy mixins sources interfaces to target. |
> | replace | :B: Boolean. Optional. (default: [interf.\_config.mixin.replace](../core/configure.md)) If properties with same names will be found in target and mixin source, will be replaced by new (from mixin source, prefer last). |
> | notConfigurableNotWritableError | :B: Boolean. Optional. (default: [interf.\_config.mixin.notConfigurableNotWritableError](../core/configure.md)) If replace is set to true and will be found property with same name and target property will be not configurable and not writable, property will be tryed to defined. This will throw Error. If false, property will be not tryed to defined, also Error will be not throwed. |
> | ignore.protoProps | :A: Array. Optional. (default: [interf.\_config.mixin.ignore.protoProps](../core/configure.md)) Class proptotype properties names that will be ignored anyway. This array will be merged with array from config. |
> | ignore.staticProps | :A: Array. Optional. (default: [interf.\_config.mixin.ignore.staticProps](../core/configure.md)) Class properties (static) names that will be ignored anyway. This array will be merged with array from config. |
>
> ---
>
> **target**  
> Type: :C: Class or :O: Class.prototype  
> Class to which or class prototype to which constructor and prototype will be sets properties from source.
> 
> ---
> 
> Return value  
> Type: :C: **Class**  
> Class of target  

#### Examples

```javascript
const MixinsInitiable = interf.interfaces.MixinsInitiable;
const Flyable = interf.create('Flyable');
const Quackable = interf.create('Quackable');

const Duck = interf.implement(Flyable, Quackable).in(class Duck {
    constructor(type) {
        this.wings = 2;
        this.type = type;
    }
    fly() {
        return 'fly';
    }
});
Duck.quack = () => 'quack';

const RedHeadDuck = interf.mix(Duck).in(class RedHeadDuck {
    constructor() {
        if (MixinsInitiable.isInterfaceOf(this)) {
        // or if (typeof this.initMixins === 'function') {
          const everyMixinConstructorArguments = ['animal'];
          this.initMixins(...everyMixinConstructorArguments);
        }
    }
});

const arnold = new RedHeadDuck();

arnold instanceof Duck // false
Flyable.isInterfaceOf(arnold) // true
Quackable.isInterfaceOf(arnold) // true
MixinsInitiable.isInterfaceOf(arnold) // true

arnold.fly(); // 'fly'
arnold.type === 'animal'; // true
arnold.wings === 2; // true
RedHeadDuck.quack() // 'quack'
```



