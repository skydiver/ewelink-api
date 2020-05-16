const rp = require('request-promise');

const WebSocket = require('./WebSocket');
const payloads = require('../../lib/payloads');
const { _get } = require('../helpers/utilities');

class ChangeStateZeroconf extends WebSocket {
  static async set({ url, device, params, switches, state }) {
    const selfApikey = device.apikey;
    const deviceId = device.deviceid;
    const deviceKey = device.devicekey;

    const endpoint = switches ? 'switches' : 'switch';
    const localUrl = `${url}/${endpoint}`;

    const body = payloads.zeroConfUpdatePayload(
      selfApikey,
      deviceId,
      deviceKey,
      params
    );

    const response = await rp({
      method: 'POST',
      uri: localUrl,
      body,
      json: true,
    });

    const error = _get(response, 'error', false);

    if (error === 403) {
      return { error, msg: response.reason };
    }

    return { status: 'ok', state };
  }
}

module.exports = ChangeStateZeroconf;
