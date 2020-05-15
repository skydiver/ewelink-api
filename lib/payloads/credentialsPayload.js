const nonce = require('nonce')();

const { APP_ID } = require('../constants');
const { makeFakeIMEI } = require('../ewelink-helper');

const credentialsPayload = ({ email, password }) => ({
  email,
  password,
  version: 6,
  ts: `${Math.round(new Date().getTime() / 1000)}`,
  nonce: `${nonce()}`,
  appid: APP_ID,
  imei: makeFakeIMEI(),
  os: 'iOS',
  model: 'iPhone10,6',
  romVersion: '11.1.2',
  appVersion: '3.5.3',
});

module.exports = credentialsPayload;
