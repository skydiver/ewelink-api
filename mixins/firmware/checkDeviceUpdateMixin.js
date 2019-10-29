const { _get } = require('../../lib/helpers');

const checkDeviceUpdateMixin = {
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

    const model = _get(device, 'extra.extra.model', false);
    const fwVersion = _get(device, 'params.fwVersion', false);

    if (!model || !fwVersion) {
      return { error: 500, msg: "Can't get model or firmware version" };
    }

    const update = await this.makeRequest({
      method: 'POST',
      url: this.getOtaUrl(),
      uri: '/app',
      body: {
        deviceInfoList: [{ model, version: fwVersion, deviceid: deviceId }],
      },
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

module.exports = checkDeviceUpdateMixin;
