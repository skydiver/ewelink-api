const { APP_ID } = require('../data/constants');
const { timestamp, nonce } = require('../helpers/utilities');

const credentialsPayload = ({ email, phoneNumber, password }) => ({
  appid: APP_ID,
  email,
  phoneNumber,
  password,
  ts: timestamp,
  version: 8,
  nonce,
});

module.exports = credentialsPayload;
