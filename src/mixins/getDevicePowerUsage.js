const { _get } = require('../../lib/helpers');

const parsePowerUsage = require('../helpers/parsePowerUsage');

module.exports = {
  /**
   * Get device power usage for current month
   *
   * @param deviceId
   *
   * @returns {Promise<{error: string}|{daily: *, monthly: *}>}
   */
  async getDevicePowerUsage(deviceId) {
    const response = await this.getDevicePowerUsageRaw(deviceId);

    const error = _get(response, 'error', false);
    const hundredDaysKwhData = _get(response, 'data.hundredDaysKwhData', false);

    if (error) {
      return response;
    }

    return {
      status: 'ok',
      ...parsePowerUsage({ hundredDaysKwhData }),
    };
  },
};
