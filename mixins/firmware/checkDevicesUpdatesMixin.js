const { _get } = require('../../lib/helpers');
const payloads = require('../../lib/payloads');

const checkDevicesUpdatesMixin = {
  async checkDevicesUpdates() {
    const devicesRaw = await this.getDevices();

    const error = _get(devicesRaw, 'error', false);
    const devices = _get(devicesRaw, 'devicelist', false);

    if (error) {
      return devices;
    }

    const deviceInfoList = payloads.firmwareUpdate(devices);

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

module.exports = checkDevicesUpdatesMixin;
