# setDevicePowerState

Change specified device power state.


### Usage
```js
  const status = await connection.setDevicePowerState('<your device id>', 'on');
  console.log(status);
```

```js
  // multi-channel devices like Sonoff 4CH
  const status = await connection.setDevicePowerState('<your device id>', 'toggle', <channel>);
  console.log(status);
```

Possible states: `on`, `off`, `toggle`.

<sup>* _Remember to instantiate class before use_</sup>


### Response example
```js
  {
    status: 'ok',
    state: 'on',
    channel: 1
  }
```