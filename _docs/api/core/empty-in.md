# interf.empty\(\).in\(\)

**Description:** Remove all interfaces from class.

---
> ```javascript
interf.empty([options]).in(target);
return :B: true|false;
```
> 
> **options**  
> Type: :O: PlainObject  
> ##### A map of options to pass to the method.
> 
> | Property name | Description |
> | :--- | :--- |
> | debug | :B: Boolean. Optional. (default: [interf._config.debug](configure.md)) Option to call [options.callbacks.debug](configure.md) (avialable only in full build) |
> | callbacks.debug | :F: Function. Optional. (default: [interf._config.callbacks.debug](configure.md)) Function that be called if [options.debug](configure.md) is true (avialable only in full build)|
> | warn | :B: Boolean. Optional. (default: [interf._config.warn](configure.md)) Option to call [options.callbacks.warn](configure.md). It may be called in cases if some interfaces was not found in prototype interfaces or was removed but same interface still exist in parents prototypes interfaces or other interfaces parents |
> | callbacks.warn | :F: Function. Optional. (default: [interf._config.callbacks.warn](configure.md)) Function that be called if [options.warn](configure.md) is true |
>
> ---
>
> **target**  
> Type: :C: Class or :O: Class.prototype  
> Class from which or class prototype from which constructor will be interfaces removed.
> 
> ---
> 
> Return value  
> Type: :B: **Boolean**  
> Result of removing

#### Examples

```javascript
const Flyable = interf.create('Flyable');
const Quackable = interf.create('Quackable');

const Duck = interf.implement(Flyable, Quackable).in(class Duck {});

interf.empty().in(Duck); // true
interf.empty({warn: true, debug: true}).in(Duck); // false & warn calling
```



