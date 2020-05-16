const { APP_ID } = require('../constants');
const { makeTimestamp } = require('../ewelink-helper');

const wssUpdatePayload = ({ apiKey, deviceId, params }) => {
  const payload = {
    action: 'update',
    apikey: apiKey,
    deviceid: deviceId,
    selfApikey: apiKey,
    params,
    ts: makeTimestamp,
    userAgent: 'ewelink-api',
    sequence: Math.floor(makeTimestamp * 1000),
  };
  return JSON.stringify(payload);
};

module.exports = wssUpdatePayload;
