const { _get } = require('../../lib/helpers');
const errors = require('../../lib/errors');

const { getDeviceChannelCount } = require('../../lib/ewelink-helper');

module.exports = {
  /**
   * Get device channel count
   *
   * @param deviceId
   *
   * @returns {Promise<{switchesAmount: *, status: string}|{msg: string, error: *}>}
   */
  async getDeviceChannelCount(deviceId) {
    const device = await this.getDevice(deviceId);
    const error = _get(device, 'error', false);
    const uiid = _get(device, 'extra.extra.uiid', false);
    const switchesAmount = getDeviceChannelCount(uiid);

    if (error) {
      return { error, msg: errors[error] };
    }

    return { status: 'ok', switchesAmount };
  },
};
