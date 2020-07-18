# setWSDevicePowerState

Change specified device power state using WebSockets.

Possible states: `on`, `off`, `toggle`.

### Usage
```js
  const status = await connection.setWSDevicePowerState('<your device id>', 'on');
  console.log(status);
```

```js
  // multi-channel devices like Sonoff 4CH
  // example will toggle power state on channel 3
  const status = await connection.setWSDevicePowerState('<your device id>', 'toggle', {
    channel: 3,
  });
  console.log(status);
```

```js
  // to control a shared device using a second account, add "shared" setting
  const status = await connection.setWSDevicePowerState('<your device id>', 'off', {
    shared: true
  });
  console.log(status);
```

```js
  // turn on channel 2 on a shared multi-channel device
  const status = await connection.setWSDevicePowerState('<your device id>', 'on', {
    channel: 2,
    shared: true
  });
  console.log(status);
```


<sup>* _Remember to instantiate class before use_</sup>


### Response example
```js
  {
    status: 'ok',
    state: 'on',
    channel: 1
  }
```