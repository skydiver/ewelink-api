const { _get } = require('../../lib/helpers');
const errors = require('../data/errors');
const { getDeviceChannelCount } = require('../../lib/ewelink-helper');

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
    const device = await this.getDevice(deviceId);
    const error = _get(device, 'error', false);
    const uiid = _get(device, 'extra.extra.uiid', false);

    let state = _get(device, 'params.switch', false);
    const switches = _get(device, 'params.switches', false);

    const switchesAmount = getDeviceChannelCount(uiid);

    if (switchesAmount > 0 && switchesAmount < channel) {
      return { error: 404, msg: errors.ch404 };
    }

    if (error || (!state && !switches)) {
      return { error, msg: errors[error] };
    }

    if (switches) {
      state = switches[channel - 1].switch;
    }

    return { status: 'ok', state };
  },
};
