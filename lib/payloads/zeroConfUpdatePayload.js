const { encryptationData } = require('../../src/helpers/ewelink');
const { timestamp } = require('../helpers');

const zeroConfUpdatePayload = (selfApikey, deviceId, deviceKey, params) => {
  const encryptedData = encryptationData(JSON.stringify(params), deviceKey);
  const sequence = Math.floor(timestamp * 1000);

  return {
    sequence: sequence.toString(),
    deviceid: deviceId,
    selfApikey,
    iv: encryptedData.iv,
    encrypt: true,
    data: encryptedData.data,
  };
};

module.exports = zeroConfUpdatePayload;
