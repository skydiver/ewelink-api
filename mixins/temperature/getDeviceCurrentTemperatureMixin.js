const { _get } = require('../../lib/helpers');

const getDeviceCurrentTemperatureMixin = {
  /**
   * Get device current temperature
   *
   * @param deviceId
   *
   * @returns {Promise<{temperature: *, status: string}|{msg: string, error: *}>}
   */
  async getDeviceCurrentTemperature(deviceId) {
    const device = await this.getDevice(deviceId);
    const error = _get(device, 'error', false);
    const model = _get(device, 'extra.extra.model', '');
    const temperature = _get(device, 'params.currentTemperature', false);

    if (error || model !== 'PSA-BHA-GL' || !temperature) {
      if (error && parseInt(error) === 401) {
        return device;
      }
      return { error, msg: 'Device does not exist' };
    }

    return { status: 'ok', temperature };
  },
};

module.exports = getDeviceCurrentTemperatureMixin;
