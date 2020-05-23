const { _get } = require('../helpers/utilities');

const DevicePowerUsageRaw = require('../classes/DevicePowerUsageRaw');

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

    return DevicePowerUsageRaw.get(actionParams);
  },
};
