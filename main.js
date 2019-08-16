const rp = require('request-promise');

const { _get } = require('./lib/helpers');

const {
  makeAuthorizationSign,
  getDeviceChannelCount,
} = require('./lib/ewelink-helper');

const payloads = require('./lib/payloads');

const { ChangeState } = require('./classes/PowerState');
const { DeviceRaw, CurrentMonth } = require('./classes/PowerUsage');

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
   * @param uri
   * @param body
   * @param qs
   *
   * @returns {Promise<{msg: string, error: *}>}
   */
  async makeRequest({ method = 'GET', uri, body = {}, qs = {} }) {
    const { at } = this;

    if (!at) {
      await this.login();
    }

    const response = await rp({
      method,
      uri: `${this.getApiUrl()}${uri}`,
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

  /**
   * Helper to login into eWeLink API
   *
   * @returns {Promise<{msg: string, error: *}>}
   */
  async login() {
    const body = payloads.loginPayload({
      email: this.email,
      password: this.password,
    });

    let response = await rp({
      method: 'POST',
      uri: `${this.getApiUrl()}/user/login`,
      headers: { Authorization: `Sign ${makeAuthorizationSign(body)}` },
      body,
      json: true,
    });

    const error = _get(response, 'error', false);
    const region = _get(response, 'region', false);

    if (error && [400, 401, 404].indexOf(parseInt(error)) !== -1) {
      return { error, msg: 'Authentication error' };
    }

    if (error && parseInt(error) === 301 && region) {
      if (this.region !== region) {
        this.region = region;
        response = await this.login();
        return response;
      }
      return { error, msg: 'Region does not exist' };
    }

    this.apiKey = _get(response, 'user.apikey', '');
    this.at = _get(response, 'at', '');
    return response;
  }

  /**
   * Check if authentication credentials doesn't exists then perform a login
   *
   * @returns {Promise<void>}
   */
  async logIfNeeded() {
    if (!this.at) {
      await this.login();
    }
  }

  /**
   * Get specific device information
   *
   * @returns {Promise<{msg: string, error: *}>}
   */
  async getDevices() {
    return this.makeRequest({
      uri: '/user/device',
      qs: { lang: 'en', getTags: 1 },
    });
  }

  /**
   * Get information about all associated devices to account
   *
   * @param deviceId
   *
   * @returns {Promise<{msg: string, error: *}>}
   */
  async getDevice(deviceId) {
    return this.makeRequest({
      uri: `/user/device/${deviceId}`,
      qs: { lang: 'en', getTags: 1 },
    });
  }

  /**
   * Get current power state for a specific device
   *
   * @param deviceId
   * @param channel
   *
   * @returns {Promise<{state: *, status: string}|{msg: string, error: *}>}
   */
  async getDevicePowerState(deviceId, channel = 1) {
    const device = await this.getDevice(deviceId);
    const error = _get(device, 'error', false);
    let state = _get(device, 'params.switch', false);
    const switches = _get(device, 'params.switches', false);
    const switchesAmount = getDeviceChannelCount(device.uiid);

    if (error || switchesAmount < channel || (!state && !switches)) {
      if (error && parseInt(error) === 401) {
        return device;
      }
      return { error, msg: 'Device does not exist' };
    }

    if (switches) {
      state = switches[channel - 1].switch;
    }

    return { status: 'ok', state };
  }

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
    const status = _get(device, 'params.switch', false);
    const switches = _get(device, 'params.switches', false);
    const switchesAmount = getDeviceChannelCount(device.uiid);

    if (error || switchesAmount < channel || (!status && !switches)) {
      if (error && parseInt(error) === 401) {
        return device;
      }
      return { error, msg: 'Device does not exist' };
    }

    let stateToSwitch = state;

    if (state === 'toggle') {
      stateToSwitch = status === 'on' ? 'off' : 'on';
    }

    const params = {};

    if (switches) {
      params.switches = switches;
      params.switches[channel - 1].switch = stateToSwitch;
    } else {
      params.switch = stateToSwitch;
    }

    return ChangeState.set({
      apiUrl: this.getApiWebSocket(),
      at: this.at,
      apiKey: this.apiKey,
      deviceId,
      params,
      state: stateToSwitch,
    });
  }

  /**
   * Toggle power state for a specific device
   *
   * @param deviceId
   * @param channel
   *
   * @returns {Promise<{state: *, status: string}|{msg: string, error: *}>}
   */
  async toggleDevice(deviceId, channel = 1) {
    return this.setDevicePowerState(deviceId, 'toggle', channel);
  }

  /**
   * Get device raw power usage
   *
   * @param deviceId
   *
   * @returns {Promise<{error: string}|{response: {hundredDaysKwhData: *}, status: string}>}
   */
  async getDeviceRawPowerUsage(deviceId) {
    await this.logIfNeeded();

    return DeviceRaw.get({
      apiUrl: this.getApiWebSocket(),
      at: this.at,
      apiKey: this.apiKey,
      deviceId,
    });
  }

  /**
   * Get device power usage for current month
   *
   * @param deviceId
   *
   * @returns {Promise<{error: string}|{daily: *, monthly: *}>}
   */
  async getDevicePowerUsage(deviceId) {
    const response = await this.getDeviceRawPowerUsage(deviceId);

    const error = _get(response, 'error', false);
    const hundredDaysKwhData = _get(response, 'data.hundredDaysKwhData', false);

    if (error) {
      return response;
    }

    return {
      status: 'ok',
      ...CurrentMonth.parse({ hundredDaysKwhData }),
    };
  }
}

module.exports = eWeLink;
