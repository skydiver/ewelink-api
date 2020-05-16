const { _get } = require('../../lib/helpers');

const { DeviceRaw } = require('../../classes/PowerUsage');

module.exports = {
  /**
   * Get device raw power usage
   *
   * @param deviceId
   *
   * @returns {Promise<{error: string}|{response: {hundredDaysKwhData: *}, status: string}>}
   */
  async getDevicePowerUsageRaw(deviceId) {
    const device = await this.getDevice(deviceId);
    const deviceApiKey = _get(device, 'apikey', false);

    const actionParams = {
      apiUrl: this.getApiWebSocket(),
      at: this.at,
      apiKey: this.apiKey,
      deviceId,
    };

    if (this.apiKey !== deviceApiKey) {
      actionParams.apiKey = deviceApiKey;
    }

    return DeviceRaw.get(actionParams);
  },
};
