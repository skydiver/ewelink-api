const { checkDevicesUpdates } = require('./checkDevicesUpdates');
const { checkDeviceUpdate } = require('./checkDeviceUpdate');
const { getCredentials } = require('./getCredentials');
const { getDevice } = require('./getDevice');
const { getDeviceChannelCount } = require('./getDeviceChannelCount');
const { getDeviceCurrentTH } = require('./getDeviceCurrentTH');
const { getDeviceIP } = require('./getDeviceIP');
const { getDevicePowerUsage } = require('./getDevicePowerUsage');
const { getDevicePowerUsageRaw } = require('./getDevicePowerUsageRaw');
const { getDevices } = require('./getDevices');
const { getFirmwareVersion } = require('./getFirmwareVersion');
const { getRegion } = require('./getRegion');
const { saveDevicesCache } = require('./saveDevicesCache');

const mixins = {
  checkDevicesUpdates,
  checkDeviceUpdate,
  getCredentials,
  getDevice,
  getDeviceChannelCount,
  getDeviceCurrentTH,
  getDeviceIP,
  getDevicePowerUsage,
  getDevicePowerUsageRaw,
  getDevices,
  getFirmwareVersion,
  getRegion,
  saveDevicesCache,
};

module.exports = mixins;
