const { _get } = require('../helpers/utilities');
const errors = require('../data/errors');

module.exports = {
  /**
   * Change power state for a specific device
   *
   * @param deviceId
   * @param state
   * @param channel
   *
   * @returns {Promise<{state: *, status: string}|{msg: string, error: *}>}
   */
  async setDevicePowerState(deviceId, state, channel = 1) {
    const device = await this.getDevice(deviceId);

    /** Check for errors */
    const error = _get(device, 'error', false);
    if (error) {
      throw new Error(`[${error}] ${errors[error]}`);
    }

    let status = _get(device, 'params.switch', false);
    const switches = _get(device, 'params.switches', false);

    const switchesAmount = switches.length;

    if (switchesAmount > 0 && switchesAmount < channel) {
      throw new Error(`${errors.ch404}`);
    }

    let stateToSwitch = state;
    const params = {};

    if (switches) {
      status = switches[channel - 1].switch;
    }

    if (state === 'toggle') {
      stateToSwitch = status === 'on' ? 'off' : 'on';
    }

    if (switches) {
      params.switches = switches;
      params.switches[channel - 1].switch = stateToSwitch;
    } else {
      params.switch = stateToSwitch;
    }

    // DISABLED DURING v4.0.0 DEVELOPMENT
    // if (this.devicesCache) {
    //   return ChangeStateZeroconf.set({
    //     url: this.getZeroconfUrl(device),
    //     device,
    //     params,
    //     switches,
    //     state: stateToSwitch,
    //   });
    // }

    const response = await this.makeRequest({
      method: 'post',
      uri: '/v2/device/thing/status',
      body: {
        type: 1,
        id: deviceId,
        params,
      },
    });

    const responseError = _get(response, 'error', false);

    if (responseError) {
      throw new Error(`[${error}] ${errors[error]}`);
    }

    return { status: 'ok', state, channel };
  },
};
