const nonce = require('nonce')();
const { APP_ID } = require('../constants');
const { timestamp } = require('../helpers');

const wssLoginPayload = ({ at, apiKey }) => {
  const payload = {
    action: 'userOnline',
    at,
    apikey: apiKey,
    appid: APP_ID,
    nonce: `${nonce()}`,
    ts: timestamp,
    userAgent: 'ewelink-api',
    sequence: Math.floor(timestamp * 1000),
    version: 8,
  };

  return JSON.stringify(payload);
};

module.exports = wssLoginPayload;
