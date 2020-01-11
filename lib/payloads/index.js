const firmwareUpdate = require('./firmwareUpdate');
const credentialsPayload = require('./credentialsPayload');
const wssLoginPayload = require('./wssLoginPayload');
const wssUpdatePayload = require('./wssUpdatePayload');
const zeroConfUpdatePayload = require('./zeroConfUpdatePayload');

module.exports = {
  firmwareUpdate,
  credentialsPayload,
  wssLoginPayload,
  wssUpdatePayload,
  zeroConfUpdatePayload,
};
