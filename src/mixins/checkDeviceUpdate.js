const errors = require('../data/errors');

module.exports = {
  /**
   * Check device firmware update
   *
   * @param deviceId
   *
   * @returns {Promise<{msg: string, version: *}|{msg: string, error: number}|{msg: string, error: *}|Device|{msg: string}>}
   */
  async checkDeviceUpdate(deviceId) {
    const updates = await this.checkDevicesUpdates();

    const update = updates.find((device) => device.deviceId === deviceId);

    if (!update) {
      throw new Error(`${errors.noFirmware}`);
    }

    return update;
  },
};
