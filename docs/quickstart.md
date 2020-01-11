# Quickstart

Here is a basic node script to start working with the module:

> Default region of this library is `us`. If your are in a different one, **you must** specify region parameter or error 400/401 will be returned.

```js
const ewelink = require('ewelink-api');

/* instantiate class */
const connection = new ewelink({
  email: '<your ewelink email>',
  password: '<your ewelink password>',
  region: '<your ewelink region>',
});

/* get all devices */
const devices = await connection.getDevices();
console.log(devices);
```

> If you don't know your region, use [getRegion](available-methods/getregion.md) method