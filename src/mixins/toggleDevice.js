module.exports = {
  /**
   * Toggle power state for a specific device
   *
   * @param deviceId
   * @param channel
   *
   * @returns {Promise<{state: *, status: string}|{msg: string, error: *}>}
   */
  async toggleDevice(deviceId, channel = 1) {
    return this.setDevicePowerState(deviceId, 'toggle', channel);
  },
};
