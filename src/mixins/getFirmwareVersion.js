const { _get } = require('../helpers/utilities');
const errors = require('../data/errors');

module.exports = {
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
      return { error, msg: errors[error] };
    }

    return { status: 'ok', fwVersion };
  },
};
