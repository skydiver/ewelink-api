# saveDevicesCache

Save devices cache file (required when using zeroconf)


### Usage
```
  const ewelink = require('ewelink-api');

  const connection = new ewelink({
    email: '<your ewelink email>',
    password: '<your ewelink password>',
    region: '<your ewelink region>',
  });

  await connection.saveDevicesCache();
```

A file named devices-cache.json will be created.