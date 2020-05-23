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

    const error = _get(device, 'error', false);

    if (error) {
      return device;
    }

    const deviceInfoList = parseFirmwareUpdates([device]);

    const deviceInfoListError = _get(deviceInfoList, 'error', false);

    if (deviceInfoListError) {
      return deviceInfoList;
    }

    const update = await this.makeRequest({
      method: 'post',
      url: this.getOtaUrl(),
      uri: '/app',
      body: { deviceInfoList },
    });

    const isUpdate = _get(update, 'upgradeInfoList.0.version', false);

    if (!isUpdate) {
      return { status: 'ok', msg: 'No update available' };
    }

    return {
      status: 'ok',
      msg: 'Update available',
      version: isUpdate,
    };
  },
};
