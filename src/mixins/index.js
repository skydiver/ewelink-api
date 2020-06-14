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
const { getFirmwareVersion } = require('./getFirmwareVersion');
const { getRegion } = require('./getRegion');
const { makeRequest } = require('./makeRequest');
const { openWebSocket } = require('./openWebSocket');
const { saveDevicesCache } = require('./saveDevicesCache');
const { setDevicePowerState } = require('./setDevicePowerState');
const { toggleDevice } = require('./toggleDevice');

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
  getFirmwareVersion,
  getRegion,
  makeRequest,
  openWebSocket,
  saveDevicesCache,
  setDevicePowerState,
  toggleDevice,
};

module.exports = mixins;
