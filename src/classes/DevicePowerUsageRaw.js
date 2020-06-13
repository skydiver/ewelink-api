const WebSocket = require('./WebSocket');
const wssLoginPayload = require('../payloads/wssLoginPayload');
const wssUpdatePayload = require('../payloads/wssUpdatePayload');
const { _get } = require('../helpers/utilities');
const errors = require('../data/errors');

class DevicePowerUsageRaw extends WebSocket {
  /**
   * Get specific device power usage (raw data)
   *
   * @param apiUrl
   * @param at
   * @param apiKey
   * @param deviceId
   * @returns {Promise<{error: string}|{data: {hundredDaysKwhData: *}, status: string}|{msg: any, error: *}|{msg: string, error: number}>}
   */
  static async get({ apiUrl, at, apiKey, deviceId }) {
    const payloadLogin = wssLoginPayload({ at, apiKey, appid: this.APP_ID });

    const payloadUpdate = wssUpdatePayload({
      apiKey,
      deviceId,
      params: { hundredDaysKwh: 'get' },
    });

    const response = await this.WebSocketRequest(apiUrl, [
      payloadLogin,
      payloadUpdate,
    ]);

    if (response.length === 1) {
      return { error: errors.noPower };
    }

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
