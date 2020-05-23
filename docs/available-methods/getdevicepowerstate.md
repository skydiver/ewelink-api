# getDevicePowerState

Query for specified device power status.


### Usage
```js
  const status = await connection.getDevicePowerState('<your device id>');
  console.log(status);
```

```js
  // multi-channel devices like Sonoff 4CH
  const status = await connection.getDevicePowerState('<your device id>', <channel>);
  console.log(status);
```

<sup>* _Remember to instantiate class before use_</sup>


### Response example
```js
  {
    status: 'ok',
    state: 'off',
    channel: 1
  }
```