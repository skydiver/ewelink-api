const { encryptationData } = require('../ewelink-helper');

const lanUpdatePayload = (selfApikey, deviceId, deviceKey, params) => {
  let encryptedData = encryptationData(JSON.stringify(params), deviceKey);
  const timeStamp = new Date() / 1000;
  const sequence = Math.floor(timeStamp * 1000);
  const payload = {
    sequence: sequence.toString(),
    deviceid: deviceId,
    selfApikey,
    iv: encryptedData.iv,
    encrypt: true,
    data: encryptedData.data,
  };
  return payload;
};

module.exports = lanUpdatePayload;
