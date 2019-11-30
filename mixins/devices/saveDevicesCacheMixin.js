const fs = require('fs');

const { _get } = require('../../lib/helpers');

const saveDevicesCacheMixin = {
  /**
   * Save devices cache file (useful for using zeroconf)
   * @returns {Promise<string|{msg: string, error: number}|*|Device[]|{msg: string, error: number}>}
   */
  async saveDevicesCache(fileName = './devices-cache.json') {
    const devices = await this.getDevices();

    const error = _get(devices, 'error', false);

    if (error === 406) {
      const errorResponse = { error: 401, msg: 'Authentication error' };
      console.log(errorResponse);
      return errorResponse;
    }

    if (error || !devices) {
      console.log(devices);
      return devices;
    }

    const jsonContent = JSON.stringify(devices, null, 2);

    try {
      fs.writeFileSync(fileName, jsonContent, 'utf8');
    } catch (e) {
      console.log('An error occured while writing JSON Object to File.');
      return e.toString();
    }
  },
};

module.exports = saveDevicesCacheMixin;
