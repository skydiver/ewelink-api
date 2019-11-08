const { _get } = require('../../lib/helpers');

const getDeviceMixin = {
  /**
   * Get information about all associated devices to account
   *
   * @param deviceId
   *
   * @returns {Promise<{msg: string, error: *}>}
   */
  async getDevice(deviceId) {
    // return this.makeRequest({
    //   uri: `/user/device/${deviceId}`,
    //   qs: { lang: 'en', getTags: 1 },
    // });

    const devices = await this.getDevices();
    const devicelist = _get(devices, 'devicelist', false);

    const error = _get(devices, 'error', false);

    if (error === 406) {
      return { error: 401, msg: 'Authentication error' };
    }

    if (error || !devicelist) {
      return devices;
    }

    const device = devicelist.find(dev => dev.deviceid === deviceId);

    if (!device) {
      return { error: 500, msg: 'Device does not exist' };
    }

    return device;
  },
};

module.exports = getDeviceMixin;
