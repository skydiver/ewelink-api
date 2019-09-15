const getDevicesMixin = {
  /**
   * Get specific device information
   *
   * @returns {Promise<{msg: string, error: *}>}
   */
  async getDevices() {
    return this.makeRequest({
      uri: '/user/device',
      qs: { lang: 'en', getTags: 1 },
    });
  },
};

module.exports = getDevicesMixin;
