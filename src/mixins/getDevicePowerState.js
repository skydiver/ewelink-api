const { _get } = require('../helpers/utilities');
const errors = require('../data/errors');

module.exports = {
  /**
   * Get current power state for a specific device
   *
   * @param deviceId
   * @param channel
   *
   * @returns {Promise<{state: *, status: string}|{msg: string, error: *}>}
   */
  async getDevicePowerState(deviceId, channel = 1) {
    const status = await this.makeRequest({
      uri: '/v2/device/thing/status',
      qs: {
        type: 1,
        id: deviceId,
        params: 'switch|switches',
      },
    });

    const error = _get(status, 'error', false);

    if (error) {
      throw new Error(`[${error}] ${errors[error]}`);
    }

    let state = _get(status, 'params.switch', false);
    const switches = _get(status, 'params.switches', false);

    const switchesAmount = switches ? switches.length : 1;

    if (switchesAmount > 0 && switchesAmount < channel) {
      throw new Error(`${errors.ch404}`);
    }

    if (switches) {
      state = switches[channel - 1].switch;
    }

    return { status: 'ok', state, channel };
  },
};
