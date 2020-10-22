const { _get } = require('../helpers/utilities');
const parseFirmwareUpdates = require('../parsers/parseFirmwareUpdates');

module.exports = {
  /**
   * Check device firmware update
   *
   * @param deviceId
   *
   * @returns {Promise<{msg: string, version: *}|{msg: string, error: number}|{msg: string, error: *}|Device|{msg: string}>}
   */
  async checkDeviceUpdate(deviceId) {
    const device = await this.getDevice(deviceId);
    const deviceInfoList = parseFirmwareUpdates([device]);

    const update = await this.makeRequest({
      method: 'post',
      uri: '/v2/device/ota/query',
      body: { deviceInfoList },
    });

    const isUpdate = _get(update, 'otaInfoList.0.version', false);

    return isUpdate
      ? {
          status: 'ok',
          msg: 'Update available',
          version: isUpdate,
        }
      : {
          status: 'ok',
          msg: 'No update available',
        };
  },
};
