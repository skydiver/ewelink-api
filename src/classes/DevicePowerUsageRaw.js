const WebSocket = require('./WebSocket');
const payloads = require('../../lib/payloads');
const { _get } = require('../../lib/helpers');
const errors = require('../../lib/errors');

class DevicePowerUsageRaw extends WebSocket {
  /**
   * Get specific device power usage (raw data)
   *
   * @param apiUrl
   * @param at
   * @param apiKey
   * @param deviceId
   *
   * @returns {Promise<{error: string}|{data: {hundredDaysKwhData: *}, status: string}>}
   */
  static async get({ apiUrl, at, apiKey, deviceId }) {
    const payloadLogin = payloads.wssLoginPayload({ at, apiKey });

    const payloadUpdate = payloads.wssUpdatePayload({
      apiKey,
      deviceId,
      params: { hundredDaysKwh: 'get' },
    });

    const response = await this.WebSocketRequest(apiUrl, [
      payloadLogin,
      payloadUpdate,
    ]);

    const error = _get(response[1], 'error', false);

    if (error === 403) {
      return { error, msg: response[1].reason };
    }

    const hundredDaysKwhData = _get(
      response[1],
      'config.hundredDaysKwhData',
      false
    );

    if (!hundredDaysKwhData) {
      return { error: errors.noPower };
    }

    return {
      status: 'ok',
      data: { hundredDaysKwhData },
    };
  }
}

module.exports = DevicePowerUsageRaw;
