const rp = require('request-promise');
const W3CWebSocket = require('websocket').w3cwebsocket;
const WebSocketAsPromised = require('websocket-as-promised');
const delay = require('delay');

const { _get } = require('./lib/helpers');

const {
  makeAuthorizationSign,
  loginPayload,
  wssLoginPayload,
  wssUpdatePayload,
  getDeviceChannelCount,
} = require('./lib/ewelink-helper');

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

  getApiUrl() {
    return `https://${this.region}-api.coolkit.cc:8080/api`;
  }

  getApiWebSocket() {
    return `wss://${this.region}-pconnect3.coolkit.cc:8080/api/ws`;
  }

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

  async login() {
    const body = loginPayload({
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

  async getDevices() {
    const response = await this.makeRequest({
      uri: '/user/device',
      qs: { lang: 'en', getTags: 1 },
    });
    return response;
  }

  async getDevice(deviceId) {
    const response = await this.makeRequest({
      uri: `/user/device/${deviceId}`,
      qs: { lang: 'en', getTags: 1 },
    });
    return response;
  }

  async getDevicePowerState(deviceId, channel = 1) {
    const device = await this.getDevice(deviceId);
    const error = _get(device, 'error', false);
    const switchesAmount = getDeviceChannelCount(device.uiid);
    let state = _get(device, 'params.switch', false);
    const switches = _get(device, 'params.switches', false);

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

  async setDevicePowerState(deviceId, state, channel = 1) {
    const device = await this.getDevice(deviceId);
    const error = _get(device, 'error', false);
    const switchesAmount = getDeviceChannelCount(device.uiid);
    const status = _get(device, 'params.switch', false);
    const switches = _get(device, 'params.switches', false);

    if (error || switchesAmount < channel || (!status && !switches)) {
      if (error && parseInt(error) === 401) {
        return device;
      }
      return { error, msg: 'Device does not exist' };
    }

    const params = {};

    if (switches) {
      params.switches = switches;
      params.switches[channel - 1].switch = state;
    } else {
      params.switch = state;
    }

    const payloadLogin = wssLoginPayload({ at: this.at, apiKey: this.apiKey });
    const payloadUpdate = wssUpdatePayload({
      apiKey: this.apiKey,
      deviceId,
      params,
    });

    const wsp = new WebSocketAsPromised(this.getApiWebSocket(), {
      createWebSocket: url => new W3CWebSocket(url),
    });

    await wsp.open();
    await wsp.send(payloadLogin);
    await delay(1000);
    await wsp.send(payloadUpdate);
    await wsp.close();

    return { status: 'ok', state };
  }

  async toggleDevice(deviceId, channel = 1) {
    const powerState = await this.getDevicePowerState(deviceId, channel);
    const state = _get(powerState, 'state', false);

    if (!state) {
      return { error: powerState.error, msg: 'Device does not exist' };
    }

    const newState = state === 'on' ? 'off' : 'on';

    const newResponse = await this.setDevicePowerState(
      deviceId,
      newState,
      channel
    );

    return newResponse;
  }
}

module.exports = eWeLink;
