# getDeviceCurrentTemperature

Return current temperature for specified device.


### Usage
```
  const temperature = await connection.getDeviceCurrentTemperature('<your device id>');
  console.log(temperature);
```

<sup>* _Remember to instantiate class before use_</sup>


### Response example
```js
  {
    status: 'ok',
    temperature: '20'
  }
```