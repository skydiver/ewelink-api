const crypto = require('crypto');
const random = require('random');

const DEVICE_TYPE_UUID = require('./data/devices-type-uuid');
const DEVICE_CHANNEL_LENGTH = require('./data/devices-channel-length');

const makeFakeIMEI = () => {
  const num1 = random.int(1000, 9999);
  const num2 = random.int(1000, 9999);
  return `DF7425A0-${num1}-${num2}-9F5E-3BC9179E48FB`;
};

const makeAuthorizationSign = body =>
  crypto
    .createHmac('sha256', '6Nz4n0xA8s8qdxQf2GqurZj2Fs55FUvM')
    .update(JSON.stringify(body))
    .digest('base64');

const getDeviceTypeByUiid = uiid => DEVICE_TYPE_UUID[uiid] || '';

const getDeviceChannelCountByType = deviceType =>
  DEVICE_CHANNEL_LENGTH[deviceType] || 0;

const getDeviceChannelCount = deviceUUID => {
  const deviceType = getDeviceTypeByUiid(deviceUUID);
  return getDeviceChannelCountByType(deviceType);
};

module.exports = {
  makeAuthorizationSign,
  makeFakeIMEI,
  getDeviceChannelCount,
};
