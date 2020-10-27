const fs = require('fs');

module.exports = {
  /**
   * Save devices cache file (useful for using zeroconf)
   * @returns {Promise<string|{msg: string, error: number}|*|Device[]|{msg: string, error: number}>}
   */
  async saveDevicesCache(fileName = './devices-cache.json') {
    const devices = await this.getDevices();

    const jsonContent = JSON.stringify(devices, null, 2);

    try {
      fs.writeFileSync(fileName, jsonContent, 'utf8');
      return { status: 'ok', file: fileName };
    } catch (e) {
      throw new Error('An error occured while writing JSON Object to File.');
    }
  },
};
