const { checkDevicesUpdates } = require('./checkDevicesUpdates');
const { checkDeviceUpdate } = require('./checkDeviceUpdate');
const deviceControl = require('./deviceControl');
const { getCredentials } = require('./getCredentials');
const { getDevice } = require('./getDevice');
const { getDeviceChannelCount } = require('./getDeviceChannelCount');
const getDeviceCurrentTH = require('./getDeviceCurrentTH');
const { getDeviceIP } = require('./getDeviceIP');
const { getDevicePowerState } = require('./getDevicePowerState');
const { getDevicePowerUsage } = require('./getDevicePowerUsage');
const { getDevicePowerUsageRaw } = require('./getDevicePowerUsageRaw');
const { getDevices } = require('./getDevices');
const { getHomepage } = require('./getHomepage');
const { getFirmwareVersion } = require('./getFirmwareVersion');
const { getRegion } = require('./getRegion');
const { makeRequest } = require('./makeRequest');
const openWebSocket = require('./openWebSocket');
const { saveDevicesCache } = require('./saveDevicesCache');
const { setDevicePowerState } = require('./setDevicePowerState');
const { toggleDevicePowerState } = require('./toggleDevicePowerState');

const mixins = {
  checkDevicesUpdates,
  checkDeviceUpdate,
  ...deviceControl,
  getCredentials,
  getDevice,
  getDeviceChannelCount,
  ...getDeviceCurrentTH,
  getDeviceIP,
  getDevicePowerState,
  getDevicePowerUsage,
  getDevicePowerUsageRaw,
  getDevices,
  getHomepage,
  getFirmwareVersion,
  getRegion,
  makeRequest,
  ...openWebSocket,
  saveDevicesCache,
  setDevicePowerState,
  toggleDevicePowerState,
};

module.exports = mixins;
