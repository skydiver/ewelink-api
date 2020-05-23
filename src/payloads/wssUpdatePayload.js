const { timestamp } = require('../helpers/utilities');

const wssUpdatePayload = ({ apiKey, deviceId, params }) => {
  const payload = {
    action: 'update',
    apikey: apiKey,
    deviceid: deviceId,
    selfApikey: apiKey,
    params,
    ts: timestamp,
    userAgent: 'ewelink-api',
    sequence: Math.floor(timestamp * 1000),
  };
  return JSON.stringify(payload);
};

module.exports = wssUpdatePayload;
