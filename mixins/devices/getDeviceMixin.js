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
      return (
        this.devicesCache.filter(function(item) {
          return item.deviceid === deviceId;
        })[0] || null
      );
    }

    return this.makeRequest({
      uri: `/user/device/${deviceId}`,
      qs: { lang: 'en', getTags: 1 },
    });
  },
};

module.exports = getDeviceMixin;
