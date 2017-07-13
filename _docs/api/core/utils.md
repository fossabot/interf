# interf.utils

**Description:** Utilities functions of interf. May be usefull for somebody.

---
> ##### getProto\(object\)
> polyfill for some old Opera browsers
> ```javascript
> // realization
> interf.utils.getProto = Object.getPrototypeOf || (obj => obj.__proto__);
> ```
> ##### getSymbols\(object\)
> get symbols, if method `Object.getOwnPropertySymbols` not provided, will return empty array
> ```javascript
> // realization
> interf.utils.getSymbols = Object.getOwnPropertySymbols || (() => []);
> ```
> ##### addArray\(target, source\)
> add source array elements to target array in fastest way (source array may be arguments array)
> ```javascript
> // usage
> const target = [1,2];
> const source = [3,4];
> const result = interf.utils.addArray(target, source);
> console.log(result); // [1,2,3,4]
> console.log(target); // [1,2,3,4]
> result === target // true
> ```
> ##### mergeObjects\(target, source\)
> merge source object values in target object recursively, arrays merged by addArray (used for `assignObjects()`)
> ```javascript
> // usage
> const target = {
>     debug: true,
>     mixin: {
>         warn: false,
>     },
> };
> const source = {
>     debug: false,
>     warn: false,
> };
> const result = interf.utils.mergeObjects(target, source);
> console.log(JSON.stringify(result)); // {debug: false, mixin: { warn: false }, warn: false}
> console.log(JSON.stringify(target)); // {debug: false, mixin: { warn: false }, warn: false}
> result === target // true
> ```
> ##### assignObjects\(object1[, object2[, ...[, objectN]]]]\)
> merge objects values in new obj, arrays merged by addArray, new empty object `{}` will be assigned firstly underhood (same speed as `Object.assign()`, but IE 9+ supported)
> ```javascript
> // usage
> const object1 = {
>     debug: true,
>     mixin: {
>         warn: false,
>     },
> };
> const object2 = {
>     debug: false,
>     warn: false,
> };
> const result = interf.utils.assignObjects(object1, object2);
> console.log(JSON.stringify(result)); // {debug: false, mixin: { warn: false }, warn: false}
> console.log(JSON.stringify(object1)); // {debug: true, mixin: { warn: false }}
> result === object1 // false
> ```
