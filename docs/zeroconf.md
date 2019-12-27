# Zeroconf (LAN mode)

⚠️⚠️⚠️ ARTICLE UNDER CONSTRUCTION ⚠️⚠️⚠️

> Zeroconf only works if you're connected to the same network of the device you wanna control.


## Notes
* at this time, only turn on/off action is available.
* after initial setup, internet connection is not required to turn on/off your devices.


## Introduction
Before start, you will need to create 2 files with information about your devices (the library includes methods to generate both files).
1. a cache file with information about your devices.
2. an "arp table" cache file with info from your network connected devices.
3. toggle specific device power state


## 1. Generate devices cache file

```js
const ewelink = require('ewelink-api');

const connection = new ewelink({
  email: '<your ewelink email>',
  password: '<your ewelink password>',
  region: '<your ewelink region>',
});

await connection.saveDevicesCache();
```

A file named `devices-cache.json` will be created.


## 2. Generate arp table cache file

```js
const Zeroconf = require('ewelink-api/classes/Zeroconf');

await Zeroconf.saveArpTable({
  ip: '<your network addres, ex: 192.168.5.1>'
});
```

A file named `arp-table.json` will be created.


## 3. toggle device power state

```js
const ewelink = require('ewelink-api');
const Zeroconf = require('ewelink-api/classes/Zeroconf');

/* load cache files */
const devicesCache = await Zeroconf.loadCachedDevices();
const arpTable = await Zeroconf.loadArpTable();

/* create the connection using cache files */
const connection = new ewelink({ devicesCache, arpTable });

/* turn device on */
await connection.setDevicePowerState('<your device id>', 'on');

/* turn device off */
await connection.setDevicePowerState('<your device id>', 'off');
```