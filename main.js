const rp = require('request-promise');

const { _get } = require('./lib/helpers');
const errors = require('./lib/errors');

class eWeLink {
  constructor({
    region = 'us',
    email,
    password,
    at,
    apiKey,
    devicesCache,
    arpTable,
  }) {
    if (!devicesCache && !arpTable && !at && !email && !password) {
      return { error: 'No credentials provided' };
    }

    this.region = region;
    this.email = email;
    this.password = password;
    this.at = at;
    this.apiKey = apiKey;
    this.devicesCache = devicesCache;
    this.arpTable = arpTable;
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
   * Generate Zeroconf URL
   * @param device
   * @returns {string}
   */
  getZeroconfUrl(device) {
    const ip = this.getDeviceIP(device);
    return `http://${ip}:8081/zeroconf`;
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
      await this.getCredentials();
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

    if (error) {
      return { error, msg: errors[error] };
    }

    return response;
  }
}

/* LOAD MIXINS: user */
const getCredentialsMixin = require('./mixins/user/getCredentialsMixin');
const getRegionMixin = require('./mixins/user/getRegionMixin');

/* LOAD MIXINS: power state */
const getDevicePowerStateMixin = require('./mixins/powerState/getDevicePowerStateMixin');
const setDevicePowerState = require('./mixins/powerState/setDevicePowerStateMixin');
const toggleDeviceMixin = require('./mixins/powerState/toggleDeviceMixin');

/* LOAD MIXINS: power usage */
const getDevicePowerUsageMixin = require('./mixins/powerUsage/getDevicePowerUsageMixin');
const getDeviceRawPowerUsageMixin = require('./mixins/powerUsage/getDeviceRawPowerUsageMixin');

/* LOAD MIXINS: websocket */
const openWebSocketMixin = require('./mixins/websocket/openWebSocketMixin');

Object.assign(eWeLink.prototype, getCredentialsMixin, getRegionMixin);

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

Object.assign(eWeLink.prototype, openWebSocketMixin);

const mixins = require('./src/mixins');

Object.assign(eWeLink.prototype, mixins);

module.exports = eWeLink;
