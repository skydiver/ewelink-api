const nonce = require('nonce')();
const { APP_ID } = require('../constants');
const { makeTimestamp } = require('../ewelink-helper');

const wssLoginPayload = ({ at, apiKey }) => {
  const payload = {
    action: 'userOnline',
    at,
    apikey: apiKey,
    appid: APP_ID,
    nonce: `${nonce()}`,
    ts: makeTimestamp,
    userAgent: 'ewelink-api',
    sequence: Math.floor(makeTimestamp * 1000),
    version: 8,
  };

  return JSON.stringify(payload);
};

module.exports = wssLoginPayload;
