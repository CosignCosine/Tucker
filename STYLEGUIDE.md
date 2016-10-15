# Style Guide
When working on this bot, please use these styling conventions: 

**If Statements**

Avoid using non-braced `if` statements unless it makes a clearly more simplistic way of writing a set of `if` statements. This is due to the fact that several non-braced `if` statements make a lot of code harder to debug because an occasional line could overflow the `if` statment.
```javascript
if (x) {
}
```

**Switch Statements**

```javascript
switch(x) {
    case "oOo": {

    } break;
}
```

**Loops**

```javascript
for () {
    // Code...
}
```

**Functions**

Only use anonymous functions for your code and use lowerCamelCase for naming conventions.
```js
function doThisCoolThing () {
}
```

**ES6**

Arrow functions and other ES6 goodies may be used if they clearly provide an advantage over their ES5 counterparts. If they do not, we advise using them to avoid confusion of their proper usage.

This guide is a WIP, and I plan to include more in the future. Thank you!
