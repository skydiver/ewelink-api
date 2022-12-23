const { _get, timestamp, nonce } = require('../helpers/utilities');
const errors = require('../data/errors');


const ChangeStateZeroconf = require('../classes/ChangeStateZeroconf');

module.exports = {
  /**
   * Change power state for a specific device
   *
   * @param deviceId
   * @param params
   * @param channel
   *
   * @returns {Promise<{params: *, status: string}|{msg: string, error: *}>}
   */
  async setDeviceParams(deviceId, params) {
    const device = await this.getDevice(deviceId);
    const error = _get(device, 'error', false);

    let status = _get(device, 'params.switch', false);


    if (error || (!status)) {
      return { error, msg: errors[error] };
    }


    if (this.devicesCache) {
      return ChangeStateZeroconf.set({
        url: this.getZeroconfUrl(device),
        device,
        params,
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

    return { status: 'ok', params };
  },
};
