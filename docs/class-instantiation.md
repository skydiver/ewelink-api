# Class Instantiation

* Default region of this library is `us`. If your are in a different one, **you must** specify region parameter or error 400/401 will be returned.

* If you don't know your region, use [getRegion](available-methods/getregion) method

* To get your access token and api key, use [getCredentials](available-methods/getcredentials) method

## Using email and password
```
  const connection = new ewelink({
    email: '<your ewelink email>',
    password: '<your ewelink password>',
    region: '<your ewelink region>',
  });
```

## Using phone number and password
```
  const connection = new ewelink({
    phoneNumber: '<your phone number>',
    password: '<your ewelink password>',
    region: '<your ewelink region>',
  });
```

## Using access token and api key
```
  const connection = new ewelink({
    at: '<valid access token>',
    apiKey: '<valid api key>',
    region: '<your ewelink region>',
  });
```

## Custom APP_ID and APP_SECRET
This library uses an APP ID and APP Secret provided by Sonoff team.
If you want to specify another pair of settings, just pass in the class constructor:
```
  const connection = new ewelink({
    email: '<your ewelink email>',
    password: '<your ewelink password>',
    APP_ID: 'CUSTOM APP ID',
    APP_SECRET: 'CUSTOM APP SECRET',
  });
```

## Using devices and arp table cache files
Check [ZeroConf](zeroconf.md) docs for detailed information.
