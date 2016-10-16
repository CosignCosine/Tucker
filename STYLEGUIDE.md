# Style Guide
*Written by KCF and Blaze

When working on this bot, please use these styling conventions: 

**Variables & Constants**

Use `const` where available to provide a clear distinction in a specific variable's usage. `let` may be used, but we heavily discourage it unless it's absolutely necessary (which it never is...except in that one time I had to use it). Function-scoped variables should be good for everything else though.

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

Please do not use ES6 at the present because of its unpredictable nature when using Cloud9. Instead, please use ES5 workarounds, or at least until the future when the system is perfected. [Here is a list of the workarounds.](es6-features.org/)

This guide is a WIP, and I plan to include more in the future. Thank you!
