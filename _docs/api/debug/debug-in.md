# interf.debug\(\).in\(\)

**Description:** Provide information about target interfaces.

---
> ```javascript
interf.debug([infoType1[, infoType2[, ...[, infoTypeN]]]]).in(target);
return :O: PlainObject;
```
> 
> **infoTypeN**  
> Type: :S: String  
> Type of requested information, possible values: 'all', 'duplicates', 'tree', 'list'.
>
> ---
>
> **target**  
> Type: :C: Class or :O: Class.prototype  
> Class from which or class prototype from which constructor and wich parents will be information get.
> 
> ---
> 
> Return value  
> Type: :O: **PlainObject**  
> According to infoType`s will be contain appropriate information  
> 

---

> ```javascript
interf.debug(infoTypeArray).in(target);
return :O: PlainObject;
```
> 
> **infoTypeArray**  
> Type: :A: Array  
> Array of types of requested information, possible values: 'all', 'duplicates', 'tree', 'list'.
>
> ---
>
> **target**  
> Type: :C: Class or :O: Class.prototype  
> Class from which or class prototype from which constructor and wich parents will be information get.
> 
> ---
> 
> Return value  
> Type: :O: **PlainObject**  
> According to infoType`s will be contain appropriate information  

#### Examples

```javascript
const Flyable = interf.create('Flyable');
const Speakable = interf.create('Speakable');
const Quackable = interf.create('Quackable', [Speakable]);

const Bird = interf.implement(Flyable).in(class Bird {});
const Duck = interf.implement(Flyable, Quackable).in(class Duck extends Bird {});

const info = interf.debug('all').in(Duck)
JSON.stringify(info); /* {
"list": [
    {
        "interface":{"name":"Flyable"},
        "implementedIn":[
            {"constructorName":"Bird","asExtendedInterface":false,"proto":{}},
            {"constructorName":"Duck","asExtendedInterface":false,"proto":{}}
        ]
    },{
        "interface":{
            "extends":[{"name":"Speakable"}],
            "name":"Quackable"
        },
        "implementedIn":[
            {"constructorName":"Duck","asExtendedInterface":false,"proto":{}}
        ]
    },{
        "interface":{"name":"Speakable"},
        "implementedIn":[
            {"constructorName":"Duck","asExtendedInterface":true,"proto":{}}
        ]
    }
],
"tree": [
    {
        "constructorName":"Object",
        "proto":{},
        "interfaces":[]
    },
    {
        "constructorName":"Bird",
        "proto":{},
        "interfaces":[{"name":"Flyable"}]
    },
    {
        "constructorName":"Duck",
        "proto":{},
        "interfaces":[
            {"name":"Flyable"},
            {
                "extends":[{"name":"Speakable"}],
                "name":"Quackable"
            }
        ]
    }
],
"duplicates": [
    {
        "interface":{"name":"Flyable"},
        "implementedIn":[
            {"constructorName":"Bird","asExtendedInterface":false,"proto":{}},
            {"constructorName":"Duck","asExtendedInterface":false,"proto":{}}
        ]
    }
]
} */
```