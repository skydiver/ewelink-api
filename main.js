const {
  APP_ID: DEFAULT_APP_ID,
  APP_SECRET: DEFAULT_APP_SECRET,
} = require('./src/data/constants');

const mixins = require('./src/mixins');
const errors = require('./src/data/errors');

class eWeLink {
  constructor(parameters = {}) {
    const {
      region = 'us',
      email = null,
      phoneNumber = null,
      password = null,
      at = null,
      apiKey = null,
      devicesCache = null,
      arpTable = null,
      APP_ID = DEFAULT_APP_ID,
      APP_SECRET = DEFAULT_APP_SECRET,
    } = parameters;

    const check = this.checkLoginParameters({
      region,
      email,
      phoneNumber,
      password,
      at,
      apiKey,
      devicesCache,
      arpTable,
    });

    if (check === false) {
      throw new Error(errors.invalidCredentials);
    }

    this.region = region;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.password = password;
    this.at = at;
    this.apiKey = apiKey;
    this.devicesCache = devicesCache;
    this.arpTable = arpTable;

    this.APP_ID = APP_ID;
    this.APP_SECRET = APP_SECRET;
  }

  // eslint-disable-next-line class-methods-use-this
  checkLoginParameters(params) {
    const { email, phoneNumber, password, devicesCache, arpTable, at } = params;

    if (email !== null && phoneNumber !== null) {
      return false;
    }

    if (
      (email !== null && password !== null) ||
      (phoneNumber !== null && password !== null) ||
      (devicesCache !== null && arpTable !== null) ||
      at !== null
    ) {
      return true;
    }

    return false;
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
}

Object.assign(eWeLink.prototype, mixins);

module.exports = eWeLink;
