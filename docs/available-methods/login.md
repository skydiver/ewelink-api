# Login

> DEPRECATED: use [getCredentials](available-methods/getcredentials.md) method instead

Login into eWeLink API and get auth credentials.

This method is useful on serverless context, where you need to obtain auth credentials to make individual requests.


### Usage
```
  const auth = await connection.login();

  console.log('access token: ', auth.at);
  console.log('api key: ', auth.user.apikey);
  console.log('region: ', auth.region);

```

<sup>* _Remember to instantiate class before use_</sup>