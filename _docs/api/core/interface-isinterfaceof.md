# Interface.isInterfaceOf\(\)

**Description:** Tests whether an object in its prototype chain has interface in \_\_interfaces\_ property.

---
> ```javascript
> Interface.isInterfaceOf(object);
> return :B: true|false;
> ```
> **Interface**  
> Type: :I: Interface (Object)  
> Interface to test against.
>
> ---
>
> **object**  
> Type: :O: Object  
> The object to test.
>
> ---
>
> Return value  
> Type: :B: **Boolean**  
> Test result  

#### Examples

```javascript
// create interface
const Quackable = interf.create('Quackable');
// implement interface
const Duck = interf.implement(Quackable).in(class Duck {
    instanceOf(target) {
        if (typeof target.isInterfaceOf === 'function' &&
            target.isInterfaceOf(this)) return true;
        return typeof target === 'function' &&
            this instanceof target;
    }
});
// create object
const donald = new Duck();

// test object by Interface.isInterfaceOf()
Quackable.isInterfaceOf(donald); // true

// test object by own method
donald.instanceOf(Quackable) // true
```



