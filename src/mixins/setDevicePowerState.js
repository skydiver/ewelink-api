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

    if (switchesAmount > 0) {
      if (Array.isArray(channel)) {
        for (let i = 0; i < channel.length; i++) {
          if (switchesAmount < channel[i]) {
            return { error: 404, msg: errors.ch404 };
          }
        }
      }
      else {
        if (channel != 0 && switchesAmount < channel) {
          return { error: 404, msg: errors.ch404 };
        }  
      }
    }

    if (error || (!status && !switches)) {
      return { error, msg: errors[error] };
    }

    let stateToSwitch = state;
    const params = {};

    if (switches) {
      if (Array.isArray(channel)) {
        status = switches[channel[0] - 1].switch;
      }
      else if (channel == 0) {
        status = switches[0].switch;
      }
      else {
        status = switches[channel - 1].switch;
      }
    }

    if (state === 'toggle') {
      stateToSwitch = status === 'on' ? 'off' : 'on';
    }

    if (switches) {
      params.switches = switches;
      if (Array.isArray(channel)) {
        // for (let i = 0; i < switchesAmount; i++) {
        //   params.switches[i].switch = stateToSwitch === 'on' ? 'off' : 'on';
        // }
        for (let i = 0; i < channel.length; i++) {
          params.switches[channel[i] - 1].switch = stateToSwitch;
        }
      }
      else if (channel == 0) {
        for (let i = 0; i < switchesAmount; i++) {
          params.switches[i].switch = stateToSwitch;
        }
      }
      else {
        params.switches[channel - 1].switch = stateToSwitch;
      }
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
