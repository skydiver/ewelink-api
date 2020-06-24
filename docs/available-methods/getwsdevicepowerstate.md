# getWSDevicePowerState

Query for specified device power status using WebSockets.


### Usage
```js
  // get device power status
  const status = await connection.getWSDevicePowerState('<your device id>');
  console.log(status);
```

```js
  // get device power status using a secondary account
  const status = await connection.getWSDevicePowerState('<your device id>', {
    shared: true,
  });
  console.log(status);
```

```js
  // get channel 3 power status on multi-channel device
  const status = await connection.getWSDevicePowerState('<your device id>', {
    channel: 3,
  });
  console.log(status);
```

```js
  // get all channels power status on multi-channel device
  const status = await connection.getWSDevicePowerState('<your device id>', {
    allChannels: true,
  });
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

```js
  {
    status: 'ok',
    state: [
      { channel: 1, state: 'off' },
      { channel: 2, state: 'off' },
      { channel: 3, state: 'off' },
      { channel: 4, state: 'off' }
    ]
  }
```