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
  * [login](#login)
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
> If you don't know your region, use [getRegion](#getregion) method

### getRegion
