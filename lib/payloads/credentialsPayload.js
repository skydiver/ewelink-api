const nonce = require('nonce')();

const { APP_ID } = require('../constants');

const credentialsPayload = ({ email, password }) => ({
  appid: APP_ID,
  email,
  password,
  ts: `${Math.round(new Date().getTime() / 1000)}`,
  version: 8,
  nonce: `${nonce()}`,
});

module.exports = credentialsPayload;
