const { _get } = require('../../lib/helpers');

const { getDeviceChannelCount } = require('../../lib/ewelink-helper');
const { ChangeState } = require('../../classes/PowerState');

const setDevicePowerState = {
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
    const error = _get(device, 'error', false);
    const uiid = _get(device, 'extra.extra.uiid', false);

    let status = _get(device, 'params.switch', false);
    const switches = _get(device, 'params.switches', false);

    const switchesAmount = getDeviceChannelCount(uiid);

    if (switchesAmount > 0 && switchesAmount < channel) {
      return { error, msg: 'Device channel does not exist' };
    }

    if (error || (!status && !switches)) {
      if (error && parseInt(error) === 401) {
        return device;
      }
      return { error, msg: 'Device does not exist' };
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

    if (this.devicesCache) {
      const url = this.getZeroConfigUrl(device);

      return ChangeState.setZeroConf({
        url,
        device,
        params,
        state: stateToSwitch,
      });
    }
    return ChangeState.set({
      apiUrl: this.getApiWebSocket(),
      at: this.at,
      apiKey: this.apiKey,
      deviceId,
      params,
      state: stateToSwitch,
    });
  },
};

module.exports = setDevicePowerState;
