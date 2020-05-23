const { APP_ID } = require('../data/constants');
const { timestamp, nonce } = require('../helpers/utilities');

const deviceStatus = ({ deviceId, params }) => ({
  deviceid: deviceId,
  appid: APP_ID,
  nonce,
  ts: timestamp,
  version: 8,
  params,
});

module.exports = deviceStatus;
