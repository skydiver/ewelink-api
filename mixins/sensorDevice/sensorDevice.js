const { _get } = require('../../lib/helpers');

const sensorDevice = {
  /**
   * Get generic sensor device property
   * @param deviceId
   * @param type
   * @returns {Promise<{measure: *, status: string}|{msg: string, error: *}>}
   */
  async getSensorProperty(deviceId, type = '') {
    const device = await this.getDevice(deviceId);
    const error = _get(device, 'error', false);

    const property = _get(device, 'params.' + type, false);
 
    if (error) {
      return device;
    }

    if (!property) {
      return { error: 500, msg: "Can't read sensor data from device" };
    }

    const data = { 
                  status: 'ok', 
                  measure: humidity
                 };

    return data;
  },

  /**
   * Get device current temperature
   * @param deviceId
   * @returns {Promise<*|{temperature: *, status: string}|{msg: string, error: *}>}
   */
  async getTemperature(deviceId) {
    return this.getSensorProperty(deviceId, 'temperature');
  },

  /***
   * Get device current humidity
   * @param deviceId
   * @returns {Promise<*|{temperature: *, status: string}|{msg: string, error: *}>}
   */
  async getHumidity(deviceId) {
    return this.getSensorProperty(deviceId, 'humidity');
  },

  /**
   * Get device current dusty
   * @param deviceId
   * @returns {Promise<*|{dusty: *, status: string}|{msg: string, error: *}>}
   */
  async getDusty(deviceId) {
    return this.getSensorProperty(deviceId, 'dusty');
  },

  /**
  * Get device current noise
  * @param deviceId
  * @returns {Promise<*|{noise: *, status: string}|{msg: string, error: *}>}
  */
  async getNoise(deviceId) {
    return this.getSensorProperty(deviceId, 'noise');
  },

  /**
  * Get device current light
  * @param deviceId
  * @returns {Promise<*|{light: *, status: string}|{msg: string, error: *}>}
  */
  async getLight(deviceId) {
    return this.getSensorProperty(deviceId, 'light');
  },

  /**
  * Get device current away
  * @param deviceId
  * @returns {Promise<*|{away: *, status: string}|{msg: string, error: *}>}
  */
  async getAway(deviceId) {
    return this.getSensorProperty(deviceId, 'away');
  },


};

module.exports = sensorDevice;