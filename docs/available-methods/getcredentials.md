# getCredentials

Get your access token, api key and region.

This method is useful on serverless context, where you need to obtain auth credentials to make individual requests.


### Usage
```
  const auth = await connection.getCredentials();

  console.log('access token: ', auth.at);
  console.log('api key: ', auth.user.apikey);
  console.log('region: ', auth.region);

```

<sup>* _Remember to instantiate class before use_</sup>

> Access token and api key will be invalidate after you login again using email and password.