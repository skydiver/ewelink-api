const { timestamp, nonce } = require('../helpers/utilities');

const wssLoginPayload = ({ at, apiKey, appid }) => {
  const payload = {
    action: 'userOnline',
    at,
    apikey: apiKey,
    appid,
    nonce,
    ts: timestamp,
    userAgent: 'app',
    sequence: Math.floor(timestamp * 1000),
    version: 8,
  };

  return JSON.stringify(payload);
};

module.exports = wssLoginPayload;
