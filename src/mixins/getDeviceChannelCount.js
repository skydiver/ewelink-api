const { _get } = require('../helpers/utilities');

module.exports = {
  /**
   * Get device channel count
   *
   * @param deviceId
   *
   * @returns {Promise<{switchesAmount: *, status: string}|{msg: string, error: *}>}
   */
  async getDeviceChannelCount(deviceId) {
    const device = await this.getDevice(deviceId);

    const paramSwitch = _get(device, 'params.switch', false);
    const paramSwitches = _get(device, 'params.switches', false);

    let switchesAmount;

    if (paramSwitches) {
      switchesAmount = paramSwitches.length;
    }

    if (!paramSwitches && paramSwitch) {
      switchesAmount = 1;
    }

    return { status: 'ok', switchesAmount };
  },
};
