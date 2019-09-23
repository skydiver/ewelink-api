const wssUpdatePayload = ({ apiKey, selfApikey = '', deviceId, params }) => {
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

  if (selfApikey) {
    payload.selfApikey = selfApikey;
  }

  return JSON.stringify(payload);
};

module.exports = wssUpdatePayload;
