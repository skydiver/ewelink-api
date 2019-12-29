# getDeviceCurrentHumidity

Return current humidity for specified device.


### Usage
```
  const humidity = await connection.getDeviceCurrentHumidity('<your device id>');
  console.log(humidity);
```

<sup>* _Remember to instantiate class before use_</sup>


### Response example
```js
  {
    status: 'ok',
    humidity: '76'
  }
```