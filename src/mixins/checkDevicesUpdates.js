const compareVersions = require('compare-versions');
const parseFirmwareUpdates = require('../parsers/parseFirmwareUpdates');
const errors = require('../data/errors');

module.exports = {
  async checkDevicesUpdates() {
    const devices = await this.getDevices();

    const deviceInfoList = parseFirmwareUpdates(devices);

    const updates = await this.makeRequest({
      method: 'post',
      uri: '/v2/device/ota/query',
      body: { deviceInfoList },
    });

    const { otaInfoList } = updates;

    if (!otaInfoList) {
      throw new Error(`${errors.noFirmwares}`);
    }

    /** Get current versions */
    const currentVersions = {};
    deviceInfoList.forEach((device) => {
      currentVersions[device.deviceid] = device.version;
    });

    return otaInfoList.map((device) => {
      const current = currentVersions[device.deviceid];
      const { version } = device;
      const outdated = compareVersions(version, current);

      return {
        update: !!outdated,
        deviceId: device.deviceid,
        msg: outdated ? 'Update available' : 'No update available',
        current,
        version,
      };
    });
  },
};
