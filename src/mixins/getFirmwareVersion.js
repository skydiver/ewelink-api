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

    const fwVersion = _get(device, 'params.fwVersion', false);

    if (!fwVersion) {
      throw new Error(`${errors.noFirmware}`);
    }

    return { status: 'ok', fwVersion };
  },
};
