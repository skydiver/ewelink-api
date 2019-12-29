# getDevicePowerUsage

Returns current month power usage on device who supports electricity records, like Sonoff POW.


### Usage
```
  const usage = await connection.getDevicePowerUsage('<your device id>');
  console.log(usage);
```

<sup>* _Remember to instantiate class before use_</sup>


### Response example
```js
{
  status: 'ok',
  monthly: 109.78,
  daily:
    [
      { day: 26, usage: 4.19 },
      { day: 25, usage: 2.11 },
      { day: 24, usage: 3.74 },
      { day: 23, usage: 8.23 },
      { day: 22, usage: 3.16 },
      { day: 21, usage: 3.95 },
      { day: 20, usage: 3.38 },
      { day: 19, usage: 4.56 },
      { day: 18, usage: 1.51 },
      { day: 17, usage: 2.4 },
      { day: 16, usage: 1.5 },
      { day: 15, usage: 7.28 },
      { day: 14, usage: 7.44 },
      { day: 13, usage: 3.21 },
      { day: 12, usage: 5.5 },
      { day: 11, usage: 4.43 },
      { day: 10, usage: 3.15 },
      { day: 9, usage: 1.33 },
      { day: 8, usage: 2.9 },
      { day: 7, usage: 6.03 },
      { day: 6, usage: 7.48 },
      { day: 5, usage: 5.94 },
      { day: 4, usage: 3.64 },
      { day: 3, usage: 2.39 },
      { day: 2, usage: 3.10 },
      { day: 1, usage: 7.23 }
  ]
}
```