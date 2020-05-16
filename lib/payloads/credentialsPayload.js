const { APP_ID } = require('../constants');
const { timestamp, nonce } = require('../helpers');

const credentialsPayload = ({ email, password }) => ({
  appid: APP_ID,
  email,
  password,
  ts: timestamp,
  version: 8,
  nonce,
});

module.exports = credentialsPayload;
