# Class Instantiation

> Default region of this library is `us`. If your are in a different one, **you must** specify region parameter or error 400/401 will be returned.

**_Using email and password_**
```
  const connection = new ewelink({
    email: '<your ewelink email>',
    password: '<your ewelink password>',
    region: '<your ewelink region>',
  });
```

**_Using access token and api key_**
```
  const connection = new ewelink({
    at: '<valid access token>',
    apiKey: '<valid api key>',
    region: '<your ewelink region>',
  });
```

> * If you don't know your region, use [getRegion](available-methods/getregion) method
> * To get your access token and api key, use [getCredentials](available-methods/getcredentials) method