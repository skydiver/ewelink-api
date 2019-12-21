# getRegion

Return logged user region.

> This method only works if class is initialized using email and password.


### Usage
```
  const region = await connection.getRegion();
  console.log(region);
```

<sup>* _Remember to instantiate class before use_</sup>


### Response example
```js
  {
    email: 'user@email.com',
    region: 'us'
  }
```