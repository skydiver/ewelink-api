const rp = require('request-promise');

const { _get } = require('./lib/helpers');

class eWeLink {
  constructor({ region = 'us', email, password, at, apiKey }) {
    if (!at && (!email && !password)) {
      return { error: 'No credentials provided' };
    }

    this.region = region;
    this.email = email;
    this.password = password;
    this.at = at;
    this.apiKey = apiKey;
  }

  /**
   * Generate eWeLink API URL
   *
   * @returns {string}
   */
  getApiUrl() {
    return `https://${this.region}-api.coolkit.cc:8080/api`;
  }

  /**
   * Generate eWeLink OTA API URL
   * @returns {string}
   */
  getOtaUrl() {
    return `https://${this.region}-ota.coolkit.cc:8080/otaother`;
  }

  /**
   * Generate eWeLink WebSocket URL
   *
   * @returns {string}
   */
  getApiWebSocket() {
    return `wss://${this.region}-pconnect3.coolkit.cc:8080/api/ws`;
  }

  /**
   * Generate http requests helpers
   *
   * @param method
   * @param url
   * @param uri
   * @param body
   * @param qs
   *
   * @returns {Promise<{msg: string, error: *}>}
   */
  async makeRequest({ method = 'GET', url, uri, body = {}, qs = {} }) {
    const { at } = this;

    if (!at) {
      await this.login();
    }

    let apiUrl = this.getApiUrl();

    if (url) {
      apiUrl = url;
    }

    const response = await rp({
      method,
      uri: `${apiUrl}${uri}`,
      headers: { Authorization: `Bearer ${this.at}` },
      body,
      qs,
      json: true,
    });

    const error = _get(response, 'error', false);
    if (error && [401, 402].indexOf(parseInt(error)) !== -1) {
      return { error, msg: 'Authentication error' };
    }

    return response;
  }
}

/* LOAD MIXINS: user */
const getCredentialsMixin = require('./mixins/user/getCredentialsMixin');
const regionMixin = require('./mixins/user/getRegionMixin');

/* LOAD MIXINS: power state */
const getDevicePowerStateMixin = require('./mixins/powerState/getDevicePowerStateMixin');
const setDevicePowerState = require('./mixins/powerState/setDevicePowerStateMixin');
const toggleDeviceMixin = require('./mixins/powerState/toggleDeviceMixin');

/* LOAD MIXINS: power usage */
const getDevicePowerUsageMixin = require('./mixins/powerUsage/getDevicePowerUsageMixin');
const getDeviceRawPowerUsageMixin = require('./mixins/powerUsage/getDeviceRawPowerUsageMixin');

/* LOAD MIXINS: temperature & humidity */
const getTHMixin = require('./mixins/temphumd/getTHMixin');

/* LOAD MIXINS: devices */
const getDevicesMixin = require('./mixins/devices/getDevicesMixin');
const getDeviceMixin = require('./mixins/devices/getDeviceMixin');
const getDeviceChannelCountMixin = require('./mixins/devices/getDeviceChannelCountMixin');

/* LOAD MIXINS: firmware */
const getFirmwareVersionMixin = require('./mixins/firmware/getFirmwareVersionMixin');
const checkDeviceUpdateMixin = require('./mixins/firmware/checkDeviceUpdateMixin');
const checkDevicesUpdatesMixin = require('./mixins/firmware/checkDevicesUpdatesMixin');

/* LOAD MIXINS: websocket */
const openWebSocketMixin = require('./mixins/websocket/openWebSocketMixin');

Object.assign(eWeLink.prototype, getCredentialsMixin, regionMixin);

Object.assign(
  eWeLink.prototype,
  getDevicePowerStateMixin,
  setDevicePowerState,
  toggleDeviceMixin
);

Object.assign(
  eWeLink.prototype,
  getDevicePowerUsageMixin,
  getDeviceRawPowerUsageMixin
);

Object.assign(eWeLink.prototype, getTHMixin);

Object.assign(
  eWeLink.prototype,
  getDevicesMixin,
  getDeviceMixin,
  getDeviceChannelCountMixin
);

Object.assign(
  eWeLink.prototype,
  getFirmwareVersionMixin,
  checkDeviceUpdateMixin,
  checkDevicesUpdatesMixin
);

Object.assign(eWeLink.prototype, openWebSocketMixin);

module.exports = eWeLink;
