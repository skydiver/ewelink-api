const { _get } = require('../../lib/helpers');

const getDeviceCurrentHumidityMixin = {
  /**
   * Get device current humidity
   *
   * @param deviceId
   *
   * @returns {Promise<{humidity: *, status: string}|{msg: string, error: *}>}
   */
  async getDeviceCurrentHumidity(deviceId) {
    const device = await this.getDevice(deviceId);
    const error = _get(device, 'error', false);
    const model = _get(device, 'extra.extra.model', '');
    const humidity = _get(device, 'params.currentHumidity', false);

    if (error || model !== 'PSA-BHA-GL' || !humidity) {
      if (error && parseInt(error) === 401) {
        return device;
      }
      return { error, msg: 'Device does not exist' };
    }

    return { status: 'ok', humidity };
  },
};

module.exports = getDeviceCurrentHumidityMixin;
