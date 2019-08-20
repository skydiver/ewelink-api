const WebSocket = require('../WebSocket');
const payloads = require('../../lib/payloads');
const { _get } = require('../../lib/helpers');

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

    const error = _get(response[1], 'error', false);

    if (error === 403) {
      return { error, msg: response[1].reason };
    }

    return { status: 'ok', state };
  }
}

module.exports = ChangeState;
