const getLocalIpMixin = {
  /**
   * Get local IP address from a given MAC
   *
   * @param device
   * @returns {Promise<string>}
   */
  getLocalIp(device) {
    const mac = device.extra.extra.staMac;
    const arpItem = this.arpTable.find(
      item => item.mac.toLowerCase() === mac.toLowerCase()
    );
    return arpItem.ip;
  },
};

module.exports = getLocalIpMixin;
