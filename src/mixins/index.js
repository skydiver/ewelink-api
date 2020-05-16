const { getDevice } = require('./getDevice');
const { getDeviceChannelCount } = require('./getDeviceChannelCount');
const { getDeviceIP } = require('./getDeviceIP');
const { getDevices } = require('./getDevices');
const { saveDevicesCache } = require('./saveDevicesCache');

const mixins = {
  getDevice,
  getDeviceChannelCount,
  getDeviceIP,
  getDevices,
  saveDevicesCache,
};

module.exports = mixins;
