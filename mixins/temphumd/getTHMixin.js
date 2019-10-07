const { _get } = require('../../lib/helpers');

const getTHMixin = {
  /**
   * Get device current temperature & humidity
   * @param deviceId
   * @param type
   * @returns {Promise<{temperature: *, humidity: *, status: string}|{msg: string, error: *}>}
   */
  async getDeviceCurrentTH(deviceId, type = '') {
    const device = await this.getDevice(deviceId);
    const error = _get(device, 'error', false);
    const temperature = _get(device, 'params.currentTemperature', false);
    const humidity = _get(device, 'params.currentHumidity', false);

    if (error) {
      return device;
    }

    if (!temperature || !humidity) {
      return { error: 500, msg: "Can't read sensor data from device" };
    }

    const data = { status: 'ok', temperature, humidity };

    if (type === 'temp') {
      delete data.humidity;
    }

    if (type === 'humd') {
      delete data.temperature;
    }

    return data;
  },

  /**
   * Get device current temperature
   * @param deviceId
   * @returns {Promise<*|{temperature: *, status: string}|{msg: string, error: *}>}
   */
  async getDeviceCurrentTemperature(deviceId) {
    return this.getDeviceCurrentTH(deviceId, 'temp');
  },

  /**
   * Get device current humidity
   * @param deviceId
   * @returns {Promise<*|{temperature: *, status: string}|{msg: string, error: *}>}
   */
  async getDeviceCurrentHumidity(deviceId) {
    return this.getDeviceCurrentTH(deviceId, 'humd');
  },
};

module.exports = getTHMixin;
