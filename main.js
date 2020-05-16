const rp = require('request-promise');

const mixins = require('./src/mixins');
const { _get } = require('./src/helpers/utilities');
const errors = require('./src/data/errors');

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

Object.assign(eWeLink.prototype, mixins);

module.exports = eWeLink;
