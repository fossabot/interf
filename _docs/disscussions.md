# Disscussions

There are questions, answers to which will help to determine the direction of the further development of the library. [Join in discussion](//github.com/shvabuk/interf/wiki).

1. Will be debug panel like Vue.js devtools useful?
2. Will be implementation/removing in/from multiple targets useful? interf.implement().in(**array|coma separated**)
3. Will be mergeMethods config property for mixins useful? (If set to true (default), this will merge two conflicting methods and call the second one first)
4. Will be object (instance) handling methods useful? Examples:
```javascript
interf.object(obj).instanceOf(Interface|Constructor); // boolean
interf.object(obj).hasInterface(Interface); // boolean
interf.object(obj).hasOwnInterface(Interface); // boolean
```
5. Will be interface types cheking useful?
6. Will be interf.wrap() method useful?
It will provide more intuitive implementing syntax, but will create 1 more class under hood. Example:
```javascript
class SubClass extends interf.wrap(SuperClass|undefined).implements(...InterfaceN) {}
```
7. Will be interf.mix().in() for objects useful?
8. Will be short aliases useful? (like: Interface.of = Interface.isInterfaceOf)
9. Will be interfaces for plain object useful? Additional property to object will be added.
10. Will be functions [class-implements](http://php.net/manual/en/function.class-implements.php), [get-declared-interfaces](http://php.net/manual/en/function.get-declared-interfaces.php), [interface-exists](http://php.net/manual/en/function.interface-exists.php) like in PHP useful?

