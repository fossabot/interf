# interf.remove\(\).in\(\)

**Description:** Remove interfaces from class.

---
> ```javascript
> interf.remove(Interface1[, Interface2[, ...[, InterfaceN]]]).in(target);
> return :B: true|false;
> ```
> 
> **InterfaceN**  
> Type: :I: Interface  
> A interface.  
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

---
> ```javascript
> interf.remove(interfacesArray[, options]).in(target);
> return :B: true|false;
> ```
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
> | debug | :B: Boolean. Optional. (default: [interf.\_config.debug](configure.md)) Option to call [callbacks.debug](configure.md) (avialable only in full build) |
> | callbacks.debug | :F: Function. Optional. (default: [interf.\_config.callbacks.debug](configure.md)) Function that be called if [debug](configure.md) is true (avialable only in full build)|
> | warn | :B: Boolean. Optional. (default: [interf.\_config.warn](configure.md)) Option to call [callbacks.warn](configure.md). It may be called in cases if some interfaces was not found in prototype interfaces or was removed but same interface still exist in parents prototypes interfaces or other interfaces parents |
> | callbacks.warn | :F: Function. Optional. (default: [interf.\_config.callbacks.warn](configure.md)) Function that be called if [warn](configure.md) is true |
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

const Duck = interf.implement(Flyable, Quackable).in(class Duck {
    fly() {}
    quack() {}
});

delete Duck.prototype.fly;
interf.remove(Flyable).in(Duck); // true
interf.remove([Flyable], {warn: true}).in(Duck); // false & warn calling

delete Duck.prototype.quack;
interf.remove([Quackable], {debug: true}).in(Duck); // true
interf.remove(Quackable).in(Duck); // false
```



