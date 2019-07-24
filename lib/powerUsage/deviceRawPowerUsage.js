const WebSocketRequest = require('../websocket');
const payloads = require('../payloads');
const { _get } = require('../helpers');

/**
 * Get specific device power usage (raw data)
 *
 * @param apiUrl
 * @param at
 * @param apiKey
 * @param deviceId
 *
 * @returns {Promise<{error: string}|{response: {hundredDaysKwhData: *}, status: string}>}
 */
const deviceRawPowerUsage = async ({ apiUrl, at, apiKey, deviceId }) => {
  const payloadLogin = payloads.wssLoginPayload({ at, apiKey });

  const payloadUpdate = payloads.wssUpdatePayload({
    apiKey,
    deviceId,
    params: { hundredDaysKwh: 'get' },
  });

  const response = await WebSocketRequest(apiUrl, [
    payloadLogin,
    payloadUpdate,
  ]);

  const hundredDaysKwhData = _get(
    response[1],
    'config.hundredDaysKwhData',
    false
  );

  if (!hundredDaysKwhData) {
    return { error: 'No power usage data found.' };
  }

  return {
    status: 'ok',
    response: { hundredDaysKwhData },
  };
};

module.exports = deviceRawPowerUsage;
