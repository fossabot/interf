# interf.create\(\)

**Description:** Create new interface object.  

---
> ```javascript
> interf.create(interfaceName [, extends]);
> return :I: new Interface();
> ```
> **interfaceName**  
> Type: :S: String  
> A interface name.
>
> ---
>
> **extends**  
> Type: :A: Array  
> Array of extends interfaces.
>
> ---
>
> Return value  
> Type: :I: **Interface** (Object)  
> Created interface  

---
> ```javascript
> interf.create(properties);
> return :I: new Interface();
> ```
> **properties**  
> Type: :O: PlainObject  
> ##### A map of properties to pass to the method.
> 
> | Property name | Description |
> | :--- | :--- |
> | name | :S: String. A interface name |
> | extends | :A: Array. Optional. Extends interfaces |
> | /^\[A-Z\]+.\*/ | :-: Any. Optional. Any additional data \(property name should start with capital latin letter\) |
>
> ---
>
> Return value  
> Type: :I: **Interface** (Object)  
> Created interface  

#### Examples

```javascript
const Flyable = interf.create('Flyable');

const Speakable = interf
    .create({
        name: 'Speakable',
        Comment: 'Main interface for speakable animals and humans',
        Methods: ['speak']
    });

const Quackable = interf.create('Quackable', [Flyable, Speakable]);
```



