const { APP_ID } = require('../../lib/constants');
const { _get } = require('../../lib/helpers');

const getDevicesMixin = {
  /**
   * Get all devices information
   *
   * @returns {Promise<{msg: string, error: number}|*>}
   */
  async getDevices() {
    const timeStamp = new Date() / 1000;
    const ts = Math.floor(timeStamp);

    const response = await this.makeRequest({
      uri: '/user/device',
      qs: {
        lang: 'en',
        appid: APP_ID,
        ts,
        version: 8,
        getTags: 1,
      },
    });

    const error = _get(response, 'error', false);
    const devicelist = _get(response, 'devicelist', false);

    if (error === 406) {
      return { error: 401, msg: 'Authentication error' };
    }

    if (!devicelist) {
      return { error: 500, msg: 'No devices found' };
    }

    return devicelist;
  },
};

module.exports = getDevicesMixin;
