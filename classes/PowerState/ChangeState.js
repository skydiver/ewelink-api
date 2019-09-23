const WebSocket = require('../WebSocket');
const payloads = require('../../lib/payloads');
const { _get } = require('../../lib/helpers');

class ChangeState extends WebSocket {
  static async set({
    apiUrl,
    at,
    apiKey,
    selfApikey,
    deviceId,
    params,
    state,
  }) {
    const payloadLogin = payloads.wssLoginPayload({ at, apiKey });

    const payloadUpdate = payloads.wssUpdatePayload({
      apiKey,
      selfApikey,
      deviceId,
      params,
    });

    const response = await this.WebSocketRequest(apiUrl, [
      payloadLogin,
      payloadUpdate,
    ]);

    const error = response[1] ? _get(response[1], 'error', false) : 0;

    if (error === 403) {
      return { error, msg: response[1].reason };
    }

    return { status: 'ok', state };
  }
}

module.exports = ChangeState;
