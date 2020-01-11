# getDeviceCurrentTH

Return current temperature and humidity for specified device.


### Usage
```
  const temphumd = await connection.getDeviceCurrentTH('<your device id>');
  console.log(temphumd);
```

<sup>* _Remember to instantiate class before use_</sup>


### Response example
```js
  {
    status: 'ok',
    temperature: '20',
    humidity: '76'
  }
```