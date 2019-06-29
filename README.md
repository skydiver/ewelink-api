# ewelink-api
> eWeLink API for Node.js

## Installation
``` sh
 npm install ewelink-api
```

## Usage
```
const ewelink = require('ewelink-api');

(async () => {

  const conn = new ewelink({
    email: '<your ewelink email>',
    password: '<your ewelink password>',
  });

  /* get all devices */
  const devices = await conn.getDevices();
  console.log(devices);

})();
```

Check `demo/` directory for more examples.