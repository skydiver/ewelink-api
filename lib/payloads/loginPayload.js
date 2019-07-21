const nonce = require('nonce')();

const { makeFakeIMEI } = require('../ewelink-helper');

const loginPayload = ({ email, password }) => ({
  email,
  password,
  version: 6,
  ts: `${Math.round(new Date().getTime() / 1000)}`,
  nonce: `${nonce()}`,
  appid: 'oeVkj2lYFGnJu5XUtWisfW4utiN4u9Mq',
  imei: makeFakeIMEI(),
  os: 'iOS',
  model: 'iPhone10,6',
  romVersion: '11.1.2',
  appVersion: '3.5.3',
});

module.exports = loginPayload;
