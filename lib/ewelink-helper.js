const crypto = require('crypto');
const random = require('random');
const nonce = require('nonce')();

const makeFakeIMEI = () => {
  const num1 = random.int(1000, 9999);
  const num2 = random.int(1000, 9999);
  return `DF7425A0-${num1}-${num2}-9F5E-3BC9179E48FB`;
};

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

const wssLoginPayload = ({ at, apiKey }) => {
  const timeStamp = new Date() / 1000;
  const ts = Math.floor(timeStamp);
  const sequence = Math.floor(timeStamp * 1000);
  const payload = {
    action: 'userOnline',
    userAgent: 'app',
    version: 6,
    nonce: `${nonce()}`,
    apkVesrion: '1.8',
    os: 'ios',
    at,
    apikey: apiKey,
    ts: `${ts}`,
    model: 'iPhone10,6',
    romVersion: '11.1.2',
    sequence,
  };
  return JSON.stringify(payload);
};

const wssUpdatePayload = ({ apiKey, deviceId, params }) => {
  const timeStamp = new Date() / 1000;
  const sequence = Math.floor(timeStamp * 1000);
  const payload = {
    action: 'update',
    userAgent: 'app',
    apikey: apiKey,
    deviceid: `${deviceId}`,
    params,
    sequence,
  };
  return JSON.stringify(payload);
};

const makeAuthorizationSign = body =>
  crypto
    .createHmac('sha256', '6Nz4n0xA8s8qdxQf2GqurZj2Fs55FUvM')
    .update(JSON.stringify(body))
    .digest('base64');

module.exports = {
  makeAuthorizationSign,
  loginPayload,
  wssLoginPayload,
  wssUpdatePayload,
};
