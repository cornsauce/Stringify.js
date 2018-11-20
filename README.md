# Stringify.js

## What about stringify.js

> **NOTICE:** Stringify.js is only supported to **ES6**.
>
> You can get it solved by babel.

This is a simple helper for dump your JavaScript variable.

Stringify.js is compatible with AMD & CMD & CommonJS.

## API

- stringify(value: any) - Return a string of value.

## Usage

```js
let object = {x: 0, y: 0, z: 0};

stringify(object);
```

You'd get a string likes the following text

```text
{
  [x: String] = 0: Number
  [y: String] = 0: Number
  [z: String] = 0: Number
}: Object
```

Enjoy!