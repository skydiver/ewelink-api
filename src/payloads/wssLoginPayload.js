const { timestamp, nonce } = require('../helpers/utilities');

const wssLoginPayload = ({ at, apiKey, appid }) => {
  const payload = {
    action: 'userOnline',
    version: 8,
    ts: timestamp,
    at,
    userAgent: 'app',
    apikey: apiKey,
    appid,
    nonce,
    sequence: Math.floor(timestamp * 1000),
  };

  return JSON.stringify(payload);
};

module.exports = wssLoginPayload;
