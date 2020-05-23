# openWebSocket

Opens a socket connection to eWeLink and listen for realtime events.


### Usage

The `openWebSocket` method requires a callback function as an argument.

Once an event is received, the callback function will be executed with the server message as argument.


```js
// instantiate class
const connection = new ewelink({
  email: '<your ewelink email>',
  password: '<your ewelink password>',
  region: '<your ewelink region>',
});

// login into eWeLink
await connection.getCredentials();

// call openWebSocket method with a callback as argument
const socket = await connection.openWebSocket(async data => {
  // data is the message from eWeLink
  console.log(data)
});
```


### Response example

If everything went well, the first message will have the following format:
```js
{
  error: 0,
  apikey: '12345678-9012-3456-7890-123456789012',
  config: {
    hb: 1,
    hbInterval: 12345
  },
  sequence: '1234567890123'
}
```

When a device change his status, a similar message will be returned:
```js
{
  action: 'update',
  deviceid: '1234567890',
  apikey: '12345678-9012-3456-7890-123456789012',
  userAgent: 'device',
  sequence: '1234567890123'
  ts: 0,
  params: {
    switch: 'on'
  },
  from: 'device',
  seq: '11'
}
```



### Notes

* Because of the nature of a socket connection, the script will keep running until the connection gets closed.
* `openWebSocket` will return the socket instance
* if you need to manually kill the connection, just run `socket.close()` (where socket is the variable used).