# node script

> Default region of this library is `us`. If your are in a different one, **you must** specify region parameter or error 400/401 will be returned.

```js
const ewelink = require('ewelink-api');

(async () => {

  const connection = new ewelink({
    email: '<your ewelink email>',
    password: '<your ewelink password>',
    region: '<your ewelink region>',
  });

  /* get all devices */
  const devices = await connection.getDevices();
  console.log(devices);

  /* get specific devide info */
  const device = await connection.getDevice('<your device id>');
  console.log(device);

  /* toggle device */
  await connection.toggleDevice('<your device id>');

})();
```

> If you don't know your region, use [getRegion](/docs/available-methods/getregion.md) method