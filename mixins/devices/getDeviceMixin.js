const nonce = require('nonce')();

const { APP_ID } = require('../../lib/constants');
const { makeTimestamp } = require('../../lib/ewelink-helper');
const { _get } = require('../../lib/helpers');

const getDeviceMixin = {
  /**
   * Get information for a specific device
   *
   * @param deviceId
   * @returns {Promise<*|null|{msg: string, error: *}>}
   */
  async getDevice(deviceId) {
    if (this.devicesCache) {
      return this.devicesCache.find(dev => dev.deviceid === deviceId) || null;
    }

    const device = await this.makeRequest({
      uri: `/user/device/${deviceId}`,
      qs: {
        deviceid: deviceId,
        appid: APP_ID,
        nonce: `${nonce()}`,
        ts: makeTimestamp,
        version: 8,
      },
    });

    const error = _get(device, 'error', false);

    if (error === 404) {
      return { error, msg: 'Device does not exist' };
    }

    return device;
  },
};

module.exports = getDeviceMixin;
