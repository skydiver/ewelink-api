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
    if (this.devicesCache) {
      return this.devicesCache.find(dev => dev.deviceid === deviceId) || null;
    }

    const devices = await this.getDevices();

    const error = _get(devices, 'error', false);

    if (error === 406) {
      return { error: 401, msg: 'Authentication error' };
    }

    if (error || !devices) {
      return devices;
    }

    const device = devices.find(dev => dev.deviceid === deviceId);

    if (!device) {
      return { error: 500, msg: 'Device does not exist' };
    }

    return device;
  },
};

module.exports = getDeviceMixin;
