const { timestamp, nonce } = require('../helpers/utilities');

const deviceStatus = ({ appid, deviceId, params }) => ({
  deviceid: deviceId,
  appid,
  nonce,
  ts: timestamp,
  version: 8,
  params,
});

module.exports = deviceStatus;
