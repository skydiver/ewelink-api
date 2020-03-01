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

```js
  // custom params, e.g. when setting brightness or color temperature on LED bulb
  // (to find out the correct params, open a websocket connection, log the data,
  // make a change in the app and observe the sent payload)
  const status = await connection.setDevicePowerState('<your device id>', 'custom', <channel>, {
    white: { br: 70, ct: 30 },
    ltype: 'white'
  });
  console.log(status);
```

Possible states: `on`, `off`, `toggle`, `custom`.

<sup>* _Remember to instantiate class before use_</sup>


### Response example
```js
  {
    status: 'ok',
    state: 'on'
  }
```