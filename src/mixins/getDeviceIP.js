const errors = require('../data/errors');

module.exports = {
  /**
   * Get local IP address from a given MAC
   *
   * @param device
   * @returns {Promise<string>}
   */
  getDeviceIP(device) {
    if (!this.arpTable) {
      throw new Error(errors.noARP);
    }

    const mac = device.extra.staMac;

    const arpItem = this.arpTable.find(
      (item) => item.mac.toLowerCase() === mac.toLowerCase()
    );

    return arpItem.ip;
  },
};
