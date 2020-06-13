const { timestamp, nonce } = require('../helpers/utilities');

const credentialsPayload = ({ appid, email, phoneNumber, password }) => ({
  appid,
  email,
  phoneNumber,
  password,
  ts: timestamp,
  version: 8,
  nonce,
});

module.exports = credentialsPayload;
