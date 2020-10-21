const { _get } = require('../helpers/utilities');
const errors = require('../data/errors');

module.exports = {
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

    const { APP_ID } = this;

    const device = await this.makeRequest({
      method: 'post',
      uri: `/v2/device/thing/`,
      body: {
        thingList: [
          { id: deviceId, itemType: 1 }
        ]
      },
    });

    const error = _get(device, 'error', false);

    if (error) {
      return { error, msg: errors[error] };
    }

    if (device.thingList.length === 0) {
      throw new Error(`${errors.noDevice}`);
    }

    return device.thingList.shift().itemData;
  },
};
