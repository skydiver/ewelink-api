const { _get, timestamp, nonce } = require('../helpers/utilities');
const errors = require('../data/errors');

const { getDeviceChannelCount } = require('../helpers/ewelink');

const ChangeStateZeroconf = require('../classes/ChangeStateZeroconf');

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
    const error = _get(device, 'error', false);
    const uiid = _get(device, 'extra.extra.uiid', false);

    let status = _get(device, 'params.switch', false);
    const switches = _get(device, 'params.switches', false);

    const switchesAmount = getDeviceChannelCount(uiid);

    if (switchesAmount > 0 && switchesAmount < channel) {
      return { error: 404, msg: errors.ch404 };
    }

    if (error || (!status && !switches)) {
      return { error, msg: errors[error] };
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
      return ChangeStateZeroconf.set({
        url: this.getZeroconfUrl(device),
        device,
        params,
        switches,
        state: stateToSwitch,
      });
    }

    const { APP_ID } = this;

    const response = await this.makeRequest({
      method: 'post',
      uri: '/user/device/status',
      body: {
        deviceid: deviceId,
        params,
        appid: APP_ID,
        nonce,
        ts: timestamp,
        version: 8,
      },
    });

    const responseError = _get(response, 'error', false);

    if (responseError) {
      return { error: responseError, msg: errors[responseError] };
    }

    return { status: 'ok', state, channel };
  },
};
