const { _get } = require('../../lib/helpers');

const getFirmwareVersionMixin = {
  /**
   * Get device firmware version
   *
   * @param deviceId
   *
   * @returns {Promise<{fwVersion: *, status: string}|{msg: string, error: *}>}
   */
  async getFirmwareVersion(deviceId) {
    const device = await this.getDevice(deviceId);
    const error = _get(device, 'error', false);
    const fwVersion = _get(device, 'params.fwVersion', false);

    if (error || !fwVersion) {
      if (error === 401) {
        return device;
      }
      return { error, msg: 'Device does not exist' };
    }

    return { status: 'ok', fwVersion };
  },
};

module.exports = getFirmwareVersionMixin;
