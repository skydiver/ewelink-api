const nonce = require('nonce')();

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

module.exports = wssLoginPayload;
