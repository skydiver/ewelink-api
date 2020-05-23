const { _get } = require('../helpers/utilities');
const errors = require('../data/errors');

const { getDeviceChannelCount } = require('../helpers/ewelink');

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
