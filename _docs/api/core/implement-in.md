# interf.implement\(\).in\(\)

**Description:** Sets interfaces to class.

---
> ```javascript
interf.implement([Interface1[, Interface2[, ...[, InterfaceN]]]]).in(target);
return :C: target|target.constructor;
```
> 
> **InterfaceN**  
> Type: :I: Interface  
> A interface.
>
> ---
>
> **target**  
> Type: :C: Class or :O: Class.prototype  
> Class to which or class prototype to which constructor will be sets interfaces.
> 
> ---
> 
> Return value  
> Type: :C: **Class**  
> Class of target  
> 

---

> ```javascript
interf.implement(interfacesArray[, options]).in(target);
return :C: target|target.constructor;
```
> 
> **interfacesArray**  
> Type: :A: Array  
> Array of interfaces.
>
> ---
>
> **options**  
> Type: :O: PlainObject  
> ##### A map of options to pass to the method.
> 
> | Property name | Description |
> | :--- | :--- |
> | descriptor | :O: PlainObject. Optional. (default: [interf._config.descriptor](configure.md)) The descriptor for the '[\_\_interfaces\_](interfaces_.md)' property being defined for target class and parents classes as static property |
> | afterImplement | :B: Boolean. Optional. (default: [interf._config.afterImplement](configure.md)) Option to call [options.callbacks.afterImplement](configure.md)|
> | callbacks.afterImplement | :F: Function. Optional. (default: [interf._config.callbacks.afterImplement](configure.md)) Function that be called when each prototype will implement interfaces |
> | debug | :B: Boolean. Optional. (default: [interf._config.debug](configure.md)) Option to call [options.callbacks.debug](configure.md) (avialable only in full build) |
> | callbacks.debug | :F: Function. Optional. (default: [interf._config.callbacks.debug](configure.md)) Function that be called if [options.debug](configure.md) is true (avialable only in full build)|
>
> ---
>
> **target**  
> Type: :C: Class or :O: Class.prototype  
> Class to which or class prototype to which constructor will be sets interfaces.
> 
> ---
> 
> Return value  
> Type: :C: **Class**  
> Class of target  

#### Examples

```javascript
const Flyable = interf.create('Flyable');
const Quackable = interf.create('Quackable');

const Duck = interf.implement(Flyable, Quackable).in(class Duck {});

const Mockingjay = interf
    .implement([Flyable], {debug: true})
    .in((class Mockingjay {}).prototype);
```



