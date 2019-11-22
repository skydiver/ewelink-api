# ewelink-api
> eWeLink API for JavaScript

## Key features
* can run on browsers, node scripts or serverless environment
* set on/off devices
* get power consumption on devices like Sonoff POW
* listen for devices events


## Contents
* [Introduction](#introduction)
* [Quickstart](#quickstart)
* [Class Instantiation](#class-instantiation)
* [Demos](#demos)
* [node script](#node-script)
* [serverless](#serverless)
* [Available Methods](#available-methods)
  * [getCredentials](#getcredentials)
  * [login](#login) **DEPRECATED, please use GetCredentials**
  * [openWebSocket](#openwebsocket)
  * [getDevice](#getdevice)
  * [getDevices](#getdevices)
  * [getDevicePowerState](#getdevicepowerstate)
  * [setDevicePowerState](#setdevicepowerstate)
  * [toggleDevice](#toggleDevice)
  * [getDevicePowerUsage](#getdevicepowerusage)
  * [getDeviceCurrentTH](#getdevicecurrentth)
  * [getDeviceCurrentTemperature](#getdevicecurrenttemperature)
  * [getDeviceCurrentHumidity](#getdevicecurrenthumidity)
  * [getDeviceChannelCount](#getdevicechannelcount)
  * [getRegion](#getregion)
  * [getFirmwareVersion](#getfirmwareversion)
* [Testing](#testing)

## Introduction
eWeLink API for JavaScript is a module who let you interact directly with eWeLink API using your regular credentials.

## Getting Started

### Install master branch
```sh
 npm install ewelink-api
```
### Install a specific branch, eg release 1.10.0:
```sh
 npm i skydiver/ewelink-api#release_1.10.0
```

## Quickstart
Here is a basic node script to start working with the module:

> Default region of this library is '**us**'. If your are in a different one, you must specify region parameter or error 400/401 will be returned.

```js
const ewelink = require('ewelink-api');

/* instantiate class */
const connection = new ewelink({
  email: '<your ewelink email>',
  password: '<your ewelink password>',
  region: '<your ewelink region>',
});

/* get all devices */
const devices = await connection.getDevices();
console.log(devices);
```

> If you don't know your region, use getRegion method AFTER Class Instantiation.

## Class Instantiation
> Default region of this library is us. If your are in a different one, you must specify region parameter or error 400/401 will be returned.

Using email and password
```js
  const connection = new ewelink({
    email: '<your ewelink email>',
    password: '<your ewelink password>',
    region: '<your ewelink region>',
  });
```
Using access token
```js
  const connection = new ewelink({
    at: '<valid access token>',
    region: '<your ewelink region>',
  });
```
Using access token and api key
```js
  const connection = new ewelink({
    at: '<valid access token>',
    apiKey: '<valid api key>',
    region: '<your ewelink region>',
  });
```
> If you don't know your region, use [getRegion](#getregion) method.

## Demos
### node script
> Default region of this library is '**us**'. If your are in a different one, you must specify region parameter or error 400/401 will be returned.
```js
const ewelink = require('ewelink-api');

(async () => {

  const connection = new ewelink({
    email: '<your ewelink email>',
    password: '<your ewelink password>',
    region: '<your ewelink region>',
  });

  /* get all devices */
  const devices = await connection.getDevices();
  console.log(devices);

  /* get specific devide info */
  const device = await connection.getDevice('<your device id>');
  console.log(device);

  /* toggle device */
  await connection.toggleDevice('<your device id>');

})();
```
If you don't know your region, use [getRegion](#getregion) method

### serverless

On a serverless scenario you need to instantiate the class on every request.

So, instead of using email and password on every api call, you can login the first time then use auth credentials for future requests.

> Default region of this library is '**us**'. If your are in a different one, you must specify region parameter or error 400/401 will be returned.

/* first request: get access token and api key */
```js
(async () => {

  const connection = new ewelink({
    email: '<your ewelink email>',
    password: '<your ewelink password>',
    region: '<your ewelink region>',
  });

  const login = await connection.login();

  const accessToken = login.at;
  const apiKey = login.user.apikey
  const region = login.region;

})();
```
/* second request: use access token to request devices */
```js
(async () => {

  const newConnection = new ewelink({
    at: accessToken,
    region: region
  });

  const devices = await newConnection.getDevices();
  console.log(devices);

})();
```
/* third request: use access token to request specific device info */
```js
(async () => {

  const thirdConnection = new ewelink({
    at: accessToken,
    region: region
  });

  const device = await thirdConnection.getDevice('<your device id>');
  console.log(device);
})();
```
/* fourth request: use access token and api key to toggle specific device info */
```js
(async () => {

  const anotherNewConnection = new ewelink({
    at: accessToken,
    region: region
  });

  await anotherNewConnection.toggleDevice('<your device id>');
})();
```
If you don't know your region, use [getRegion](#getregion) method

## Available Methods
Here is the list of available methods.

Remember to instantiate the class before usage.

Also, take a look at the provided demos for [node script](#node-script) and [serverless](#serverless).

### Login
Login into eWeLink API and get auth credentials.

This method is useful on serverless context, where you need to obtain auth credentials to make individual requests.

Usage:
```js
  const auth = await connection.login();

  console.log('access token: ', auth.at);
  console.log('api key: ', auth.user.apikey);
  console.log('region: ', auth.region);
```
*\* Remember to instantiate class before use*

### openWebSocket
Opens a socket connection to eWeLink and listen for realtime events.

Usage
The **openWebSocket** method requires a callback function as an argument.

Once an event is received, the callback function will be executed with the server message as argument.
```js
// instantiate class
const connection = new ewelink({
  email: '<your ewelink email>',
  password: '<your ewelink password>',
  region: '<your ewelink region>',
});

// login into eWeLink
await connection.login();

// call openWebSocket method with a callback as argument
const socket = await connection.openWebSocket(async data => {
  // data is the message from eWeLink
  console.log(data)
});
```
Response example
If everything went well, the first message will have the following format:
```json
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
When a device changes a similar message will be returned:
```json
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
Notes
- Because of the nature of a socket connection, the script will keep running until the connection gets closed.
- openWebSocket will return the socket instance
- if you need to manually kill the connection, just run socket.close() (where socket is the variable used).
