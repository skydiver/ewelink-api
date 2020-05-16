const { _get } = require('../../lib/helpers');
const parseFirmwareUpdates = require('../helpers/parseFirmwareUpdates');

module.exports = {
  async checkDevicesUpdates() {
    const devices = await this.getDevices();

    const error = _get(devices, 'error', false);

    if (error) {
      return devices;
    }

    const deviceInfoList = parseFirmwareUpdates(devices);

    const deviceInfoListError = _get(deviceInfoList, 'error', false);

    if (deviceInfoListError) {
      return deviceInfoList;
    }

    const updates = await this.makeRequest({
      method: 'POST',
      url: this.getOtaUrl(),
      uri: '/app',
      body: { deviceInfoList },
    });

    const upgradeInfoList = _get(updates, 'upgradeInfoList', false);

    if (!upgradeInfoList) {
      return { error: "Can't find firmware update information" };
    }

    return upgradeInfoList.map(device => {
      const upd = _get(device, 'version', false);

      if (!upd) {
        return {
          status: 'ok',
          deviceId: device.deviceid,
          msg: 'No update available',
        };
      }

      return {
        status: 'ok',
        deviceId: device.deviceid,
        msg: 'Update available',
        version: upd,
      };
    });
  },
};
