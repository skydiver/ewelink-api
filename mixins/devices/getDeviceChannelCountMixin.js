const { _get } = require('../../lib/helpers');

const { getDeviceChannelCount } = require('../../lib/ewelink-helper');

const getDeviceChannelCountMixin = {
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
      if (error && parseInt(error) === 401) {
        return device;
      }
      return { error, msg: 'Device does not exist' };
    }

    return { status: 'ok', switchesAmount };
  },
};

module.exports = getDeviceChannelCountMixin;
