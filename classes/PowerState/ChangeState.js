const WebSocket = require('../WebSocket');
const payloads = require('../../lib/payloads');
const { _get } = require('../../lib/helpers');
const errors = require('../../lib/errors');

class ChangeState extends WebSocket {
  static async set({ apiUrl, at, apiKey, deviceId, params, state }) {
    const payloadLogin = payloads.wssLoginPayload({ at, apiKey });

    const payloadUpdate = payloads.wssUpdatePayload({
      apiKey,
      deviceId,
      params,
    });

    const response = await this.WebSocketRequest(apiUrl, [
      payloadLogin,
      payloadUpdate,
    ]);

    if (!response[1]) {
      return { error: errors.unknown };
    }

    const error = _get(response[1], 'error', false);

    if (error) {
      return { error, msg: response[1].reason };
    }

    return { status: 'ok', state };
  }
}

module.exports = ChangeState;
