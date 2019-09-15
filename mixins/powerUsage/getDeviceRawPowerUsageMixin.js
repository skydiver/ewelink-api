const { DeviceRaw } = require('../../classes/PowerUsage');

const getDeviceRawPowerUsageMixin = {
  /**
   * Get device raw power usage
   *
   * @param deviceId
   *
   * @returns {Promise<{error: string}|{response: {hundredDaysKwhData: *}, status: string}>}
   */
  async getDeviceRawPowerUsage(deviceId) {
    await this.logIfNeeded();

    return DeviceRaw.get({
      apiUrl: this.getApiWebSocket(),
      at: this.at,
      apiKey: this.apiKey,
      deviceId,
    });
  },
};

module.exports = getDeviceRawPowerUsageMixin;
