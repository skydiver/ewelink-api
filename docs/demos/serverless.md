# serverless

On a serverless scenario you need to instantiate the class on every request.

So, instead of using email and password on every api call, you can login the first time then use auth credentials for future requests.

> Default region of this library is `us`. If your are in a different one, **you must** specify region parameter or error 400/401 will be returned.


```js
/* first request: get access token and api key */
(async () => {

  const connection = new ewelink({
    email: '<your ewelink email>',
    password: '<your ewelink password>',
    region: '<your ewelink region>',
  });


  const credentials = await connection.getCredentials();

  const accessToken = credentials.at;
  const apiKey = credentials.user.apikey
  const region = credentials.region;

})();
```

```js
/* second request: use access token to request devices */
(async () => {

  const newConnection = new ewelink({
    at: accessToken,
    region: region
  });

  const devices = await newConnection.getDevices();
  console.log(devices);

})();
```

```js
/* third request: use access token to request specific device info */
(async () => {

  const thirdConnection = new ewelink({
    at: accessToken,
    region: region
  });

  const device = await thirdConnection.getDevice('<your device id>');
  console.log(device);

})();
```

```js
/* fourth request: use access token and api key to toggle specific device info */
(async () => {

  const anotherNewConnection = new ewelink({
    at: accessToken,
    region: region
  });

  await anotherNewConnection.toggleDevice('<your device id>');

})();
```

> If you don't know your region, use [getRegion](/docs/available-methods/getregion) method
