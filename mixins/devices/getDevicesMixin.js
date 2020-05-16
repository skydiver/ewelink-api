const { APP_ID } = require('../../lib/constants');
const { _get } = require('../../lib/helpers');
const errors = require('../../lib/errors');

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

    if (error) {
      return { error, msg: errors[error] };
    }

    if (!devicelist) {
      return { error: 404, msg: errors.noDevices };
    }

    return devicelist;
  },
};

module.exports = getDevicesMixin;
