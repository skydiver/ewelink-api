const getDeviceMixin = {
  /**
   * Get information about all associated devices to account
   *
   * @param deviceId
   *
   * @returns {Promise<{msg: string, error: *}>}
   */
  async getDevice(deviceId) {
    const devices = await this.getDevices();
    return devices.devicelist.find(dev => dev.deviceid === deviceId);
  },
};

module.exports = getDeviceMixin;
