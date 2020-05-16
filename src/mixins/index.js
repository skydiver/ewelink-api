const { checkDevicesUpdates } = require('./checkDevicesUpdates');
const { checkDeviceUpdate } = require('./checkDeviceUpdate');
const { getDevice } = require('./getDevice');
const { getDeviceChannelCount } = require('./getDeviceChannelCount');
const { getDeviceIP } = require('./getDeviceIP');
const { getDevices } = require('./getDevices');
const { getFirmwareVersion } = require('./getFirmwareVersion');
const { saveDevicesCache } = require('./saveDevicesCache');

const mixins = {
  checkDevicesUpdates,
  checkDeviceUpdate,
  getDevice,
  getDeviceChannelCount,
  getDeviceIP,
  getDevices,
  getFirmwareVersion,
  saveDevicesCache,
};

module.exports = mixins;
